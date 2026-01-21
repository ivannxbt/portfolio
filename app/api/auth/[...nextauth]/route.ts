import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { getAuthOptions, NEXTAUTH_SECRET_ERROR } from "@/lib/auth";

const authOptions = getAuthOptions();

let hasLoggedMissingConfig = false;

const respondWithMissingConfig = () => {
  if (!hasLoggedMissingConfig) {
    console.error("NextAuth is misconfigured:", NEXTAUTH_SECRET_ERROR);
    hasLoggedMissingConfig = true;
  }
  return NextResponse.json({ error: NEXTAUTH_SECRET_ERROR }, { status: 500 });
};

// NextAuth v4 App Router pattern: handler is used for both GET and POST
const handler = authOptions ? NextAuth(authOptions) : respondWithMissingConfig;

export { handler as GET, handler as POST };
