const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '');
const REMOTE_ENABLED = import.meta.env.VITE_USE_REMOTE_STORAGE !== 'false';
const FALLBACK_CLOUD_URL = 'https://api.restful-api.dev/objects/ff808181a067127101a07ba6f6c234b8';

export interface RemoteBatchResult {
  ok: boolean;
  data: Record<string, any>;
  updatedAt?: number;
}

export async function readRemoteCollection<T>(key: string, fallback: T): Promise<T> {
  if (!REMOTE_ENABLED) {
    return fallback;
  }

  try {
    const response = await fetch(`${API_BASE}/data?key=${encodeURIComponent(key)}`, {
      signal: AbortSignal.timeout(2500),
    });
    if (response.ok) {
      const json = await response.json();
      return json?.data ?? fallback;
    }
  } catch (error) {
    // Fall through to cloud direct fallback
  }

  // Cloud direct fallback
  try {
    const norm = key.startsWith('aygram/') ? key : `aygram/${key}`;
    const cloudRes = await fetch(FALLBACK_CLOUD_URL, {
      signal: AbortSignal.timeout(2000),
    });
    if (cloudRes.ok) {
      const json = await cloudRes.json();
      return json?.data?.[norm] ?? fallback;
    }
  } catch (err) {
    // Fallback silent
  }

  return fallback;
}

export async function writeRemoteCollection<T>(key: string, value: T): Promise<boolean> {
  if (!REMOTE_ENABLED) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, data: value }),
      signal: AbortSignal.timeout(2500),
    });

    if (response.ok) {
      return true;
    }
  } catch (error) {
    // Fall through to direct cloud fallback
  }

  try {
    const norm = key.startsWith('aygram/') ? key : `aygram/${key}`;
    const cloudGet = await fetch(FALLBACK_CLOUD_URL, {
      signal: AbortSignal.timeout(2000),
    });
    let existingData: Record<string, any> = {};
    if (cloudGet.ok) {
      const json = await cloudGet.json();
      if (json?.data) existingData = json.data;
    }
    existingData[norm] = value;
    const cloudPut = await fetch(FALLBACK_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'aygram_store', data: existingData }),
      signal: AbortSignal.timeout(2000),
    });
    return cloudPut.ok;
  } catch (err) {
    return false;
  }
}

export async function readRemoteBatch(): Promise<RemoteBatchResult | null> {
  if (!REMOTE_ENABLED) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/data?batch=1`, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(2500),
    });
    if (response.ok) {
      const json = await response.json();
      if (json?.ok && json.data) {
        return {
          ok: true,
          data: json.data,
          updatedAt: json.updatedAt,
        };
      }
    }
  } catch (error) {
    // Fall through to cloud direct fallback
  }

  // Cloud direct fallback
  try {
    const cloudRes = await fetch(FALLBACK_CLOUD_URL, {
      signal: AbortSignal.timeout(2000),
    });
    if (cloudRes.ok) {
      const json = await cloudRes.json();
      if (json?.data) {
        return {
          ok: true,
          data: json.data,
          updatedAt: json.updatedAt || Date.now(),
        };
      }
    }
  } catch (err) {
    // Fallback silent
  }

  return null;
}

export async function writeRemoteBatch(batch: Record<string, any>): Promise<boolean> {
  if (!REMOTE_ENABLED) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE}/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ batch }),
      signal: AbortSignal.timeout(2500),
    });

    if (response.ok) return true;
  } catch (error) {
    // Fall through
  }

  try {
    const cloudGet = await fetch(FALLBACK_CLOUD_URL, {
      signal: AbortSignal.timeout(2000),
    });
    let existingData: Record<string, any> = {};
    if (cloudGet.ok) {
      const json = await cloudGet.json();
      if (json?.data) existingData = json.data;
    }
    for (const [k, v] of Object.entries(batch)) {
      const norm = k.startsWith('aygram/') ? k : `aygram/${k}`;
      existingData[norm] = v;
    }
    const cloudPut = await fetch(FALLBACK_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'aygram_store', data: existingData }),
      signal: AbortSignal.timeout(2000),
    });
    return cloudPut.ok;
  } catch (err) {
    return false;
  }
}

