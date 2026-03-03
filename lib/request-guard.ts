import { NextRequest, NextResponse } from "next/server";

function normalizeOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getAllowedOrigins(): Set<string> {
  const allowed = new Set<string>();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    const origin = normalizeOrigin(siteUrl);
    if (origin) {
      allowed.add(origin);
    }
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const origin = normalizeOrigin(`https://${vercelUrl}`);
    if (origin) {
      allowed.add(origin);
    }
  }

  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }

  return allowed;
}

function getRequestOrigin(request: NextRequest): string | null {
  const originHeader = request.headers.get("origin");
  if (originHeader) {
    return normalizeOrigin(originHeader);
  }

  const refererHeader = request.headers.get("referer");
  if (refererHeader) {
    return normalizeOrigin(refererHeader);
  }

  return null;
}

export function guardStateChangingRequest(
  request: NextRequest,
): NextResponse | null {
  const origin = getRequestOrigin(request);
  const allowedOrigins = getAllowedOrigins();
  allowedOrigins.add(request.nextUrl.origin);

  if (!origin || !allowedOrigins.has(origin)) {
    return NextResponse.json(
      { error: "Forbidden request origin." },
      { status: 403 },
    );
  }

  const requestedWith = request.headers.get("x-requested-with");
  if (requestedWith !== "XMLHttpRequest") {
    return NextResponse.json(
      { error: "Missing CSRF protection header." },
      { status: 403 },
    );
  }

  return null;
}
