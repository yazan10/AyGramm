import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

const memoryStore = new Map<string, any>();
// Safely read Supabase config with fallbacks
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://uuksljwepytkbggbbrkz.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a07ba6f6c234b8';
let lastViteCloudSync = 0;

// Load initial database from disk
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      for (const [k, v] of Object.entries(parsed)) {
        memoryStore.set(k, v);
      }
    }
  }
} catch (e) {
  console.warn('[AyGram DB] Failed to read disk DB:', e);
}

function persistToDisk() {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    const allData: Record<string, any> = {};
    for (const [k, v] of memoryStore.entries()) {
      allData[k] = v;
    }
    const newContent = JSON.stringify(allData, null, 2);
    if (fs.existsSync(DB_FILE)) {
      try {
        const currentContent = fs.readFileSync(DB_FILE, 'utf-8');
        if (currentContent === newContent) {
          return;
        }
      } catch {}
    }
    fs.writeFileSync(DB_FILE, newContent, 'utf-8');
  } catch (e) {
    console.warn('[AyGram DB] Failed to write disk DB:', e);
  }
}

async function syncViteCloud() {
  const now = Date.now();
  if (now - lastViteCloudSync < 5000) return;
  lastViteCloudSync = now;
  try {
    const res = await fetch(CLOUD_URL, {
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        for (const [k, v] of Object.entries(json.data)) {
          memoryStore.set(k, v);
        }
        persistToDisk();
      }
    }
  } catch {}
}

async function pushViteCloud() {
  persistToDisk();
  try {
    const allData: Record<string, any> = {};
    for (const [k, v] of memoryStore.entries()) {
      allData[k] = v;
    }
    await fetch(CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'aygram_store', data: allData }),
      signal: AbortSignal.timeout(2000),
    });
  } catch {}
}

function mockApiPlugin(): Plugin {
  return {
    name: 'mock-api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        if (req.url.startsWith('/api/health') || req.url.startsWith('/api/db/status')) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            ok: true,
            service: 'AyGram Database',
            status: 'online',
            cloud: true,
            localDisk: fs.existsSync(DB_FILE),
            collectionsCount: memoryStore.size,
            timestamp: new Date().toISOString()
          }));
          return;
        }

        if (req.url.startsWith('/api/data')) {
          void syncViteCloud();
          const urlObj = new URL(req.url, 'http://localhost');
          const isBatch = urlObj.searchParams.get('batch') === '1' || urlObj.searchParams.get('all') === '1';
          const key = urlObj.searchParams.get('key') || 'aygram/default.json';

          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            if (isBatch) {
              const allData: Record<string, any> = {};
              for (const [k, v] of memoryStore.entries()) {
                allData[k] = v;
              }
              res.end(JSON.stringify({ ok: true, batch: true, data: allData, updatedAt: Date.now() }));
              return;
            }
            const data = memoryStore.get(key) ?? null;
            res.end(JSON.stringify({ ok: true, data, key, updatedAt: Date.now() }));
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body);
                if (parsed.batch && typeof parsed.batch === 'object') {
                  for (const [k, v] of Object.entries(parsed.batch)) {
                    memoryStore.set(k, v);
                  }
                  await pushViteCloud();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ ok: true, batch: true, updatedAt: Date.now() }));
                  return;
                }
                const itemKey = parsed.key || key;
                const payload = parsed.data !== undefined ? parsed.data : parsed;
                memoryStore.set(itemKey, payload);
                await pushViteCloud();
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: true, url: '', key: itemKey, updatedAt: Date.now() }));
              } catch {
                res.statusCode = 400;
                res.end(JSON.stringify({ ok: false, error: 'Invalid JSON' }));
              }
            });
            return;
          }

          if (req.method === 'DELETE') {
            memoryStore.delete(key);
            await pushViteCloud();
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, deleted: true, key, updatedAt: Date.now() }));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), mockApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: [
          '**/data/**',
          '**/database.json',
          '**/.git/**',
        ],
      },
    },
  };
});
