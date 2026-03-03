import { NextRequest, NextResponse } from "next/server";

import { defaultLocale, isValidLocale } from "./lib/i18n";

function getLocaleFromPath(pathname: string): string {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  if (firstSegment && isValidLocale(firstSegment)) {
    return firstSegment;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-locale", getLocaleFromPath(request.nextUrl.pathname));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)",
  ],
};
