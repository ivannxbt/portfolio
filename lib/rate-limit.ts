import { Redis } from "@upstash/redis";

const store = new Map<string, { count: number; resetAt: number }>();

type RateLimitOptions = {
  limit?: number;
  windowMs?: number;
};

type RateLimitResult = {
  ok: boolean;
  retryAfter?: number;
};

type RateLimitCounter = {
  count: number;
  resetAt: number;
};

type RateLimitStore = {
  increment: (key: string, windowMs: number) => Promise<RateLimitCounter>;
};

class MemoryRateLimitStore implements RateLimitStore {
  async increment(key: string, windowMs: number): Promise<RateLimitCounter> {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      const fresh = { count: 1, resetAt: now + windowMs };
      store.set(key, fresh);
      return fresh;
    }

    entry.count += 1;
    return { count: entry.count, resetAt: entry.resetAt };
  }
}

class UpstashRateLimitStore implements RateLimitStore {
  constructor(private readonly redis: Redis) {}

  async increment(key: string, windowMs: number): Promise<RateLimitCounter> {
    const now = Date.now();
    const namespacedKey = `ratelimit:${key}`;
    const count = await this.redis.incr(namespacedKey);
    if (count === 1) {
      await this.redis.pexpire(namespacedKey, windowMs);
    }

    const ttl = await this.redis.pttl(namespacedKey);
    const resetAt = now + Math.max(typeof ttl === "number" ? ttl : 0, 0);
    return { count, resetAt };
  }
}

const memoryStore = new MemoryRateLimitStore();
let cachedStore: RateLimitStore | null = null;
let hasLoggedRemoteStoreFailure = false;

function resolveRateLimitStore(): RateLimitStore {
  if (cachedStore) {
    return cachedStore;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    const redis = new Redis({ url, token });
    cachedStore = new UpstashRateLimitStore(redis);
    return cachedStore;
  }

  cachedStore = memoryStore;
  return cachedStore;
}

/**
 * Rate limiter keyed by string (typically client IP).
 * Uses Upstash Redis when configured via env vars, with in-memory fallback.
 */
export async function checkRateLimit(
  key: string,
  { limit = 10, windowMs = 60_000 }: RateLimitOptions = {},
): Promise<RateLimitResult> {
  try {
    const entry = await resolveRateLimitStore().increment(key, windowMs);
    if (entry.count > limit) {
      return {
        ok: false,
        retryAfter: Math.max(1, Math.ceil((entry.resetAt - Date.now()) / 1000)),
      };
    }
    return { ok: true };
  } catch (error) {
    if (!hasLoggedRemoteStoreFailure) {
      console.warn(
        "Rate limiter store is unavailable, using in-memory fallback:",
        error instanceof Error ? error.message : String(error),
      );
      hasLoggedRemoteStoreFailure = true;
    }
    cachedStore = memoryStore;
    const entry = await memoryStore.increment(key, windowMs);
    if (entry.count > limit) {
      return {
        ok: false,
        retryAfter: Math.max(1, Math.ceil((entry.resetAt - Date.now()) / 1000)),
      };
    }
    return { ok: true };
  }
}
