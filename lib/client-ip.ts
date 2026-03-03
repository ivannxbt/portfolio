import { NextRequest } from "next/server";

type ExtractClientIpOptions = {
  trustProxyHeaders?: boolean;
};

function normalizeIp(value: string): string | null {
  const first = value.split(",")[0]?.trim();
  if (!first) {
    return null;
  }

  if (first.startsWith("[") && first.includes("]")) {
    const end = first.indexOf("]");
    const host = first.slice(1, end).trim();
    return host || null;
  }

  if (/^\d+\.\d+\.\d+\.\d+:\d+$/.test(first)) {
    return first.slice(0, first.lastIndexOf(":"));
  }

  return first;
}

export function extractClientIpFromHeaders(
  headers: Headers,
  { trustProxyHeaders = false }: ExtractClientIpOptions = {},
): string | null {
  const managedHeaderCandidates = [
    "x-vercel-forwarded-for",
    "cf-connecting-ip",
    "fly-client-ip",
  ];

  for (const headerName of managedHeaderCandidates) {
    const value = headers.get(headerName);
    if (!value) {
      continue;
    }

    const normalized = normalizeIp(value);
    if (normalized) {
      return normalized;
    }
  }

  if (trustProxyHeaders) {
    const genericProxyHeaders = ["x-real-ip", "x-forwarded-for"];
    for (const headerName of genericProxyHeaders) {
      const value = headers.get(headerName);
      if (!value) {
        continue;
      }

      const normalized = normalizeIp(value);
      if (normalized) {
        return normalized;
      }
    }
  }

  return null;
}

export function getClientIp(request: NextRequest): string {
  const trustProxyHeaders =
    process.env.TRUST_PROXY_HEADERS === "true" ||
    process.env.NODE_ENV !== "production";

  const ip = extractClientIpFromHeaders(request.headers, { trustProxyHeaders });
  if (ip) {
    return ip;
  }

  return process.env.NODE_ENV === "production" ? "unknown" : "127.0.0.1";
}
