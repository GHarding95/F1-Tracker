export const F1_API_BASE = 'https://f1api.dev/api';

/** Calendar / “current” season shape changes rarely during a session. */
const TTL_CALENDAR_MS = 3 * 60 * 1000;

/** Standings shift after race weekends; short TTL keeps repeat visits fresh without hammering the API. */
const TTL_STANDINGS_MS = 3 * 60 * 1000;

/** Per-round race and sprint JSON is effectively static once the event is complete. */
const TTL_ROUND_RESULTS_MS = 12 * 60 * 60 * 1000;

type CacheEntry = { storedAt: number; data: unknown };

const jsonCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();

const STORAGE_KEY = 'f1tracker:f1ClientCache:v1';

type PersistedCache = Record<string, CacheEntry>;

function ttlForUrl(url: string): number {
  if (url.includes('/current') && !url.includes('championship')) return TTL_CALENDAR_MS;
  if (url.includes('drivers-championship')) return TTL_STANDINGS_MS;
  if (/\/\d+\/\d+\/(race|sprint)/.test(url)) return TTL_ROUND_RESULTS_MS;
  return TTL_CALENDAR_MS;
}

function loadPersistedCache(): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as PersistedCache;
    for (const [url, entry] of Object.entries(parsed)) {
      if (!entry || typeof entry.storedAt !== 'number') continue;
      jsonCache.set(url, entry);
    }
  } catch {
    // ignore storage failures / bad data
  }
}

function persistCache(url: string, entry: CacheEntry): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: PersistedCache = raw ? (JSON.parse(raw) as PersistedCache) : {};

    parsed[url] = entry;

    // Keep storage bounded: cap entries and remove oldest.
    const entries = Object.entries(parsed);
    const MAX_ENTRIES = 40;
    if (entries.length > MAX_ENTRIES) {
      entries.sort((a, b) => a[1].storedAt - b[1].storedAt);
      for (let i = 0; i < entries.length - MAX_ENTRIES; i++) {
        delete parsed[entries[i][0]];
      }
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch {
    // ignore storage failures / quota exceeded
  }
}

let persistedLoaded = false;

/**
 * Cached JSON fetch with in-flight deduplication (same URL in parallel → one network request).
 */
export async function f1FetchJson<T>(url: string, ttlMs?: number): Promise<T> {
  if (!persistedLoaded && typeof window !== 'undefined') {
    persistedLoaded = true;
    loadPersistedCache();
  }

  const ttl = ttlMs ?? ttlForUrl(url);
  const now = Date.now();
  const hit = jsonCache.get(url);
  if (hit && now - hit.storedAt < ttl) {
    return hit.data as T;
  }

  if (!inflight.has(url)) {
    const p = (async (): Promise<unknown> => {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Request failed (${res.status}): ${url}`);
        }
        const data = await res.json();
        const entry = { storedAt: Date.now(), data } satisfies CacheEntry;
        jsonCache.set(url, entry);
        persistCache(url, entry);
        return data;
      } finally {
        inflight.delete(url);
      }
    })();
    inflight.set(url, p);
  }

  return inflight.get(url)! as Promise<T>;
}
