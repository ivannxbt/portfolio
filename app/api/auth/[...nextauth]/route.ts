import NextAuth from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { getAuthOptions, NEXTAUTH_SECRET_ERROR } from "@/lib/auth";

const authOptions = getAuthOptions();
const handler = authOptions ? NextAuth(authOptions) : null;
let hasLoggedMissingConfig = false;

const respondWithMissingConfig = () => {
  if (!hasLoggedMissingConfig) {
    console.error("NextAuth is misconfigured:", NEXTAUTH_SECRET_ERROR);
    hasLoggedMissingConfig = true;
  }
  return NextResponse.json({ error: NEXTAUTH_SECRET_ERROR }, { status: 500 });
};

export async function GET(request: NextRequest, context: { params?: { nextauth?: string[] } }) {
  if (!handler) {
    return respondWithMissingConfig();
  }
  return handler(request, context);
}

export async function POST(request: NextRequest, context: { params?: { nextauth?: string[] } }) {
  if (!handler) {
    return respondWithMissingConfig();
  }
  return handler(request, context);
}
