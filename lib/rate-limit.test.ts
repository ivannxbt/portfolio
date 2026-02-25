import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  checkRateLimit,
  MemoryRateLimitStorage,
  resetRateLimitStorage,
  setRateLimitStorage,
} from './rate-limit';

describe('rate-limit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00.000Z'));
    setRateLimitStorage(new MemoryRateLimitStorage());
  });

  afterEach(() => {
    resetRateLimitStorage();
    vi.useRealTimers();
  });

  it('enforces retry window and resets after expiry', async () => {
    const ip = '203.0.113.1';

    await expect(checkRateLimit(ip, { limit: 2, windowMs: 10_000 })).resolves.toEqual({ ok: true });
    await expect(checkRateLimit(ip, { limit: 2, windowMs: 10_000 })).resolves.toEqual({ ok: true });

    const blocked = await checkRateLimit(ip, { limit: 2, windowMs: 10_000 });
    expect(blocked.ok).toBe(false);
    if (!blocked.ok) {
      expect(blocked.retryAfter).toBe(10);
    }

    vi.advanceTimersByTime(10_001);

    await expect(checkRateLimit(ip, { limit: 2, windowMs: 10_000 })).resolves.toEqual({ ok: true });
  });

  it('cleans up expired entries during sweep', async () => {
    const storage = new MemoryRateLimitStorage();
    setRateLimitStorage(storage);

    await checkRateLimit('198.51.100.10', {
      windowMs: 1_000,
      sweepIntervalMs: 500,
      maxEntries: 100,
    });
    await checkRateLimit('198.51.100.11', {
      windowMs: 1_000,
      sweepIntervalMs: 500,
      maxEntries: 100,
    });

    expect(await storage.size()).toBe(2);

    vi.advanceTimersByTime(1_100);

    await checkRateLimit('198.51.100.12', {
      windowMs: 1_000,
      sweepIntervalMs: 500,
      maxEntries: 100,
    });

    expect(await storage.size()).toBe(1);
  });

  it('keeps storage bounded under many unique IPs', async () => {
    const storage = new MemoryRateLimitStorage();
    setRateLimitStorage(storage);

    for (let i = 0; i < 200; i++) {
      await checkRateLimit(`203.0.113.${i}`, {
        maxEntries: 50,
        windowMs: 60_000,
        sweepIntervalMs: 60_000,
      });
      vi.advanceTimersByTime(1);
    }

    expect(await storage.size()).toBeLessThanOrEqual(50);
  });
});
