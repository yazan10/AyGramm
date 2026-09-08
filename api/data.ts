// Vercel Serverless Function: High-performance Real-Time Data Store
// Authoritative backend controller for AyGram on Vercel & Supabase
// Supports: Supabase PostgreSQL (via aygram_storage table), Memory cache, and Cloud fallback

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const config = {
  runtime: 'nodejs',
};

const GLOBAL_STORE_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a07ba6f6c234b8';
const STORAGE_PREFIX = 'aygram/';

const memoryStore = new Map<string, any>();
let lastUpdateTimestamp = Date.now();
let lastCloudSyncTime = 0;
let isStoreInitialized = false;

// Initialize Supabase client if credentials exist in env
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://uuksljwepytkbggbbrkz.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

let supabaseClient: any = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
  }
} catch (e) {
  console.warn('[AyGram Serverless] Supabase init warning:', e);
}

// Load initial seed database from disk if available
function initLocalSeed(): void {
  if (isStoreInitialized) return;
  try {
    const dbPath = path.resolve(process.cwd(), 'data/database.json');
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        for (const [k, v] of Object.entries(parsed)) {
          memoryStore.set(k, v);
        }
      }
    }
  } catch (err) {
    // Silent in serverless runtime
  }
  isStoreInitialized = true;
}

const normalizeKey = (value: string) => {
  const raw = String(value || '').trim();
  if (!raw) return 'aygram/default.json';
  return raw.startsWith(STORAGE_PREFIX) ? raw : `${STORAGE_PREFIX}${raw}`;
};

// Pull latest data from Supabase or Fallback
async function pullFromCloud(): Promise<void> {
  initLocalSeed();
  const now = Date.now();
  if (now - lastCloudSyncTime < 2500 && memoryStore.size > 0) return;

  // 1. Try Supabase first
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('aygram_storage')
        .select('key, data, updated_at');
      
      if (!error && Array.isArray(data) && data.length > 0) {
        for (const row of data) {
          if (row?.key) {
            memoryStore.set(row.key, row.data);
          }
        }
        lastCloudSyncTime = now;
        lastUpdateTimestamp = now;
        return;
      }
    } catch (err) {
      // Fall through to fallback
    }
  }

  // 2. Try REST store fallback
  try {
    const res = await fetch(GLOBAL_STORE_URL, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data && typeof json.data === 'object') {
        for (const [k, v] of Object.entries(json.data)) {
          memoryStore.set(k, v);
        }
        lastCloudSyncTime = now;
        if (json.updatedAt) lastUpdateTimestamp = json.updatedAt;
      }
    }
  } catch (err) {
    // Keep in-memory cache
  }
}

// Push to Supabase and Fallback
async function pushToCloud(keyToUpsert?: string, payloadToUpsert?: any): Promise<void> {
  const now = Date.now();
  lastUpdateTimestamp = now;

  // 1. Try Supabase
  if (supabaseClient) {
    try {
      if (keyToUpsert && payloadToUpsert !== undefined) {
        await supabaseClient.from('aygram_storage').upsert({
          key: keyToUpsert,
          data: payloadToUpsert,
          updated_at: new Date().toISOString(),
        });
      } else {
        const rows = Array.from(memoryStore.entries()).map(([key, data]) => ({
          key,
          data,
          updated_at: new Date().toISOString(),
        }));
        if (rows.length > 0) {
          await supabaseClient.from('aygram_storage').upsert(rows);
        }
      }
    } catch (err) {
      // Fall through to backup
    }
  }

  // 2. Try REST store backup
  try {
    const allData: Record<string, any> = {};
    for (const [k, v] of memoryStore.entries()) {
      allData[k] = v;
    }
    await fetch(GLOBAL_STORE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'aygram_store',
        data: allData,
      }),
      signal: AbortSignal.timeout(2000),
    });
  } catch (err) {
    // Silent
  }
}

function mergeCollection(existing: any, incoming: any): any {
  if (Array.isArray(incoming)) {
    if (!Array.isArray(existing) || existing.length === 0) return incoming;
    const hasId = incoming.some(item => item && typeof item === 'object' && item.id);
    if (hasId) {
      const map = new Map<string, any>();
      for (const item of existing) {
        if (item && item.id) map.set(item.id, item);
      }
      for (const item of incoming) {
        if (item && item.id) map.set(item.id, item);
      }
      return Array.from(map.values());
    }
    return incoming;
  }
  if (typeof incoming === 'object' && incoming !== null && typeof existing === 'object' && existing !== null) {
    return { ...existing, ...incoming };
  }
  return incoming;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & caching headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Server health / status ping
  if (req.query?.ping === '1' || req.query?.health === '1') {
    return res.status(200).json({
      ok: true,
      service: 'AyGram Universal Cloud Sync Engine',
      supabaseConnected: !!supabaseClient,
      cloudPersistence: true,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  }

  // Pull latest state
  await pullFromCloud();

  if (req.method === 'GET') {
    const isBatch = req.query?.batch === '1' || req.query?.all === '1';

    if (isBatch) {
      const allData: Record<string, any> = {};
      for (const [key, value] of memoryStore.entries()) {
        allData[key] = value;
      }
      return res.status(200).json({
        ok: true,
        batch: true,
        updatedAt: lastUpdateTimestamp,
        cloudPersistence: true,
        data: allData,
      });
    }

    const key = normalizeKey(String(req.query?.key || 'aygram/default.json'));
    const data = memoryStore.get(key) ?? null;

    return res.status(200).json({ ok: true, data, key, updatedAt: lastUpdateTimestamp });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

      // Batch save
      if (body.batch && typeof body.batch === 'object') {
        for (const [rawKey, val] of Object.entries(body.batch)) {
          const norm = normalizeKey(rawKey);
          const currentVal = memoryStore.get(norm);
          const merged = mergeCollection(currentVal, val);
          memoryStore.set(norm, merged);
        }
        await pushToCloud();
        return res.status(200).json({ ok: true, batch: true, updatedAt: lastUpdateTimestamp });
      }

      // Single item save
      const key = normalizeKey(String(body.key || 'default.json'));
      const payload = body.data !== undefined ? body.data : body;
      const currentVal = memoryStore.get(key);
      const merged = mergeCollection(currentVal, payload);
      memoryStore.set(key, merged);
      await pushToCloud(key, merged);
      return res.status(200).json({ ok: true, url: '', key, updatedAt: lastUpdateTimestamp });
    } catch (error) {
      console.error('POST /api/data failed:', error);
      return res.status(500).json({ ok: false, message: 'Failed to write data to cloud storage.' });
    }
  }

  if (req.method === 'DELETE') {
    const key = normalizeKey(String(req.query?.key || 'default.json'));
    memoryStore.delete(key);
    if (supabaseClient) {
      try {
        await supabaseClient.from('aygram_storage').delete().eq('key', key);
      } catch {}
    }
    await pushToCloud();
    return res.status(200).json({ ok: true, deleted: true, key, updatedAt: lastUpdateTimestamp });
  }

  return res.status(405).json({ ok: false, message: 'Method not allowed' });
}
