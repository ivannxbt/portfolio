export type RateLimitEntry = {
  count: number;
  resetAt: number;
  lastSeenAt: number;
};

export interface RateLimitStorage {
  get(key: string): Promise<RateLimitEntry | undefined>;
  set(key: string, value: RateLimitEntry): Promise<void>;
  delete(key: string): Promise<void>;
  size(): Promise<number>;
  pruneExpired?(now: number): Promise<number>;
  evictToLimit?(maxEntries: number, now: number): Promise<number>;
}

export class MemoryRateLimitStorage implements RateLimitStorage {
  private readonly map = new Map<string, RateLimitEntry>();

  async get(key: string) {
    return this.map.get(key);
  }

  async set(key: string, value: RateLimitEntry) {
    this.map.set(key, value);
  }

  async delete(key: string) {
    this.map.delete(key);
  }

  async size() {
    return this.map.size;
  }

  async pruneExpired(now: number) {
    let removed = 0;

    for (const [key, value] of this.map.entries()) {
      if (value.resetAt <= now) {
        this.map.delete(key);
        removed++;
      }
    }

    return removed;
  }

  async evictToLimit(maxEntries: number, now: number) {
    let evicted = 0;

    if (this.map.size <= maxEntries) {
      return evicted;
    }

    const expiredKeys: string[] = [];
    for (const [key, value] of this.map.entries()) {
      if (value.resetAt <= now) {
        expiredKeys.push(key);
      }
    }

    for (const key of expiredKeys) {
      if (this.map.size <= maxEntries) {
        break;
      }

      this.map.delete(key);
      evicted++;
    }

    if (this.map.size <= maxEntries) {
      return evicted;
    }

    const candidates = [...this.map.entries()].sort((a, b) => {
      if (a[1].lastSeenAt === b[1].lastSeenAt) {
        return a[1].resetAt - b[1].resetAt;
      }
      return a[1].lastSeenAt - b[1].lastSeenAt;
    });

    for (const [key] of candidates) {
      if (this.map.size <= maxEntries) {
        break;
      }
      this.map.delete(key);
      evicted++;
    }

    return evicted;
  }
}

type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
  maxEntries?: number;
  sweepIntervalMs?: number;
};

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number };

const DEFAULT_LIMIT = 10;
const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_ENTRIES = 10_000;
const DEFAULT_SWEEP_INTERVAL_MS = 15_000;

let storage: RateLimitStorage = new MemoryRateLimitStorage();
let lastSweepAt = 0;

export function setRateLimitStorage(nextStorage: RateLimitStorage) {
  storage = nextStorage;
  lastSweepAt = 0;
}

export function resetRateLimitStorage() {
  storage = new MemoryRateLimitStorage();
  lastSweepAt = 0;
}

async function maybeSweep(now: number, sweepIntervalMs: number) {
  if (!storage.pruneExpired) {
    return;
  }

  if (now - lastSweepAt < sweepIntervalMs) {
    return;
  }

  await storage.pruneExpired(now);
  lastSweepAt = now;
}

export async function checkRateLimit(
  ip: string,
  {
    limit = DEFAULT_LIMIT,
    windowMs = DEFAULT_WINDOW_MS,
    maxEntries = DEFAULT_MAX_ENTRIES,
    sweepIntervalMs = DEFAULT_SWEEP_INTERVAL_MS,
  }: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const now = Date.now();
  await maybeSweep(now, sweepIntervalMs);

  let entry = await storage.get(ip);

  if (!entry || now >= entry.resetAt) {
    entry = {
      count: 1,
      resetAt: now + windowMs,
      lastSeenAt: now,
    };

    await storage.set(ip, entry);

    if (storage.evictToLimit) {
      await storage.evictToLimit(maxEntries, now);
    }

    return { ok: true };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  entry.lastSeenAt = now;
  await storage.set(ip, entry);

  return { ok: true };
}
