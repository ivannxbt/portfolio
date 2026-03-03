import { describe, it, expect } from "vitest";
import { checkRateLimit } from "./rate-limit";

describe("rate-limit", () => {
  describe("checkRateLimit", () => {
    it("returns ok: true for first request", async () => {
      const result = await checkRateLimit("ip-first", {
        limit: 5,
        windowMs: 60_000,
      });
      expect(result.ok).toBe(true);
      expect(result.retryAfter).toBeUndefined();
    });

    it("returns ok: true while under limit", async () => {
      const key = "ip-under-limit";
      const limit = 3;
      for (let i = 0; i < limit; i++) {
        const result = await checkRateLimit(key, { limit, windowMs: 60_000 });
        expect(result.ok).toBe(true);
      }
    });

    it("returns ok: false and retryAfter when over limit", async () => {
      const key = "ip-over-limit";
      const limit = 2;
      await checkRateLimit(key, { limit, windowMs: 60_000 });
      await checkRateLimit(key, { limit, windowMs: 60_000 });
      const third = await checkRateLimit(key, { limit, windowMs: 60_000 });
      expect(third.ok).toBe(false);
      expect(typeof third.retryAfter).toBe("number");
      expect(third.retryAfter).toBeGreaterThan(0);
    });

    it("tracks each key independently", async () => {
      await checkRateLimit("ip-a", { limit: 1, windowMs: 60_000 });
      const aSecond = await checkRateLimit("ip-a", {
        limit: 1,
        windowMs: 60_000,
      });
      expect(aSecond.ok).toBe(false);

      const bFirst = await checkRateLimit("ip-b", {
        limit: 1,
        windowMs: 60_000,
      });
      expect(bFirst.ok).toBe(true);
    });

    it("uses default limit and window when options omitted", async () => {
      const result = await checkRateLimit("ip-defaults");
      expect(result.ok).toBe(true);
    });
  });
});
