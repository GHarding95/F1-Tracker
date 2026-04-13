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

function ttlForUrl(url: string): number {
  if (url.includes('/current') && !url.includes('championship')) return TTL_CALENDAR_MS;
  if (url.includes('drivers-championship')) return TTL_STANDINGS_MS;
  if (/\/\d+\/\d+\/(race|sprint)/.test(url)) return TTL_ROUND_RESULTS_MS;
  return TTL_CALENDAR_MS;
}

/**
 * Cached JSON fetch with in-flight deduplication (same URL in parallel → one network request).
 */
export async function f1FetchJson<T>(url: string, ttlMs?: number): Promise<T> {
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
        jsonCache.set(url, { storedAt: Date.now(), data });
        return data;
      } finally {
        inflight.delete(url);
      }
    })();
    inflight.set(url, p);
  }

  return inflight.get(url)! as Promise<T>;
}
