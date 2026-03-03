import { describe, expect, it } from "vitest";

import { extractClientIpFromHeaders } from "./client-ip";

describe("client-ip", () => {
  it("prefers managed platform headers", () => {
    const headers = new Headers({
      "x-vercel-forwarded-for": "203.0.113.10",
      "x-forwarded-for": "198.51.100.7",
    });

    expect(extractClientIpFromHeaders(headers)).toBe("203.0.113.10");
  });

  it("does not trust generic proxy headers by default", () => {
    const headers = new Headers({
      "x-forwarded-for": "198.51.100.7",
      "x-real-ip": "198.51.100.8",
    });

    expect(extractClientIpFromHeaders(headers)).toBeNull();
  });

  it("uses generic proxy headers when trustProxyHeaders is enabled", () => {
    const headers = new Headers({
      "x-forwarded-for": "198.51.100.7, 198.51.100.9",
    });

    expect(
      extractClientIpFromHeaders(headers, { trustProxyHeaders: true }),
    ).toBe("198.51.100.7");
  });

  it("normalizes ipv4 host:port values", () => {
    const headers = new Headers({
      "x-real-ip": "198.51.100.7:52341",
    });

    expect(
      extractClientIpFromHeaders(headers, { trustProxyHeaders: true }),
    ).toBe("198.51.100.7");
  });
});
