import { describe, expect, it, vi } from "vitest";

import {
  buildLoginThrottleKeys,
  clearLoginThrottle,
  getLoginThrottleStatus,
  registerFailedLoginAttempt,
} from "./login-throttle";

describe("login-throttle", () => {
  it("builds stable throttle keys for ip and email", () => {
    const keys = buildLoginThrottleKeys("127.0.0.1", "admin@example.com");
    expect(keys).toEqual([
      "login:ip:127.0.0.1",
      "login:email:admin@example.com",
    ]);
  });

  it("blocks after five failed attempts", () => {
    const key = "login:ip:test-block";
    clearLoginThrottle(key);

    for (let i = 0; i < 4; i += 1) {
      const status = registerFailedLoginAttempt(key);
      expect(status.blocked).toBe(false);
    }

    const blockedStatus = registerFailedLoginAttempt(key);
    expect(blockedStatus.blocked).toBe(true);
    expect(blockedStatus.retryAfterSeconds).toBeGreaterThan(0);

    const currentStatus = getLoginThrottleStatus(key);
    expect(currentStatus.blocked).toBe(true);
  });

  it("resets state after clear", () => {
    const key = "login:email:test-clear@example.com";
    clearLoginThrottle(key);

    for (let i = 0; i < 5; i += 1) {
      registerFailedLoginAttempt(key);
    }

    expect(getLoginThrottleStatus(key).blocked).toBe(true);
    clearLoginThrottle(key);
    expect(getLoginThrottleStatus(key).blocked).toBe(false);
  });

  it("expires lock after block duration", () => {
    vi.useFakeTimers();
    const key = "login:ip:test-expire";
    clearLoginThrottle(key);

    for (let i = 0; i < 5; i += 1) {
      registerFailedLoginAttempt(key);
    }
    expect(getLoginThrottleStatus(key).blocked).toBe(true);

    vi.advanceTimersByTime(15 * 60_000 + 1);
    expect(getLoginThrottleStatus(key).blocked).toBe(false);
    vi.useRealTimers();
  });
});
