type LoginThrottleEntry = {
  failures: number;
  windowStartedAt: number;
  blockedUntil: number;
};

type LoginThrottleStatus = {
  blocked: boolean;
  retryAfterSeconds?: number;
};

const FAILED_ATTEMPT_WINDOW_MS = 15 * 60_000;
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60_000;

const attempts = new Map<string, LoginThrottleEntry>();

function getEntry(key: string, now: number): LoginThrottleEntry {
  const existing = attempts.get(key);
  if (!existing) {
    const fresh: LoginThrottleEntry = {
      failures: 0,
      windowStartedAt: now,
      blockedUntil: 0,
    };
    attempts.set(key, fresh);
    return fresh;
  }

  if (now - existing.windowStartedAt > FAILED_ATTEMPT_WINDOW_MS) {
    existing.failures = 0;
    existing.windowStartedAt = now;
  }

  if (existing.blockedUntil > 0 && now >= existing.blockedUntil) {
    existing.blockedUntil = 0;
    existing.failures = 0;
    existing.windowStartedAt = now;
  }

  return existing;
}

function toRetryAfterSeconds(now: number, blockedUntil: number): number {
  return Math.max(1, Math.ceil((blockedUntil - now) / 1000));
}

export function buildLoginThrottleKeys(ip: string, email: string): string[] {
  return [`login:ip:${ip}`, `login:email:${email}`];
}

export function getLoginThrottleStatus(
  key: string,
  now = Date.now(),
): LoginThrottleStatus {
  const entry = getEntry(key, now);
  if (entry.blockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: toRetryAfterSeconds(now, entry.blockedUntil),
    };
  }

  return { blocked: false };
}

export function registerFailedLoginAttempt(
  key: string,
  now = Date.now(),
): LoginThrottleStatus {
  const entry = getEntry(key, now);

  if (entry.blockedUntil > now) {
    return {
      blocked: true,
      retryAfterSeconds: toRetryAfterSeconds(now, entry.blockedUntil),
    };
  }

  if (now - entry.windowStartedAt > FAILED_ATTEMPT_WINDOW_MS) {
    entry.failures = 0;
    entry.windowStartedAt = now;
  }

  entry.failures += 1;
  if (entry.failures >= MAX_FAILED_ATTEMPTS) {
    entry.blockedUntil = now + BLOCK_DURATION_MS;
    return {
      blocked: true,
      retryAfterSeconds: toRetryAfterSeconds(now, entry.blockedUntil),
    };
  }

  return { blocked: false };
}

export function clearLoginThrottle(key: string): void {
  attempts.delete(key);
}
