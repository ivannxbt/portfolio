import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

import { secretConfig } from "@/lib/secret-config";
import { extractClientIpFromHeaders } from "@/lib/client-ip";
import {
  buildLoginThrottleKeys,
  clearLoginThrottle,
  getLoginThrottleStatus,
  registerFailedLoginAttempt,
} from "@/lib/login-throttle";

const adminEmail = (secretConfig.adminEmail ?? "").toLowerCase();
const adminPasswordHash = secretConfig.adminPasswordHash;
const nextAuthSecret = secretConfig.nextAuthSecret;

export const NEXTAUTH_SECRET_ERROR =
  "NextAuth requires a secret. Provide the `NEXTAUTH_SECRET` environment variable.";

function toHeaders(value: unknown): Headers {
  const headers = new Headers();
  if (!value || typeof value !== "object") {
    return headers;
  }

  const record = value as Record<string, string | string[] | undefined>;
  for (const [key, rawValue] of Object.entries(record)) {
    if (typeof rawValue === "string") {
      headers.set(key, rawValue);
      continue;
    }

    if (Array.isArray(rawValue) && rawValue[0]) {
      headers.set(key, rawValue[0]);
    }
  }

  return headers;
}

function getClientIp(req: unknown): string {
  if (!req || typeof req !== "object") {
    return "unknown";
  }

  const request = req as { headers?: unknown };
  const trustProxyHeaders =
    process.env.TRUST_PROXY_HEADERS === "true" ||
    process.env.NODE_ENV !== "production";
  const ip = extractClientIpFromHeaders(toHeaders(request.headers), {
    trustProxyHeaders,
  });

  return ip ?? "unknown";
}

function createCredentialsProvider() {
  return CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      const email = credentials?.email?.toLowerCase().trim();
      const password = credentials?.password;
      const clientIp = getClientIp(req);
      const throttleEmail = email || "unknown";
      const throttleKeys = buildLoginThrottleKeys(clientIp, throttleEmail);

      for (const key of throttleKeys) {
        const status = getLoginThrottleStatus(key);
        if (status.blocked) {
          console.warn(
            `Admin login temporarily blocked for ${key} (retry in ${status.retryAfterSeconds}s).`,
          );
          throw new Error("Too many login attempts. Please try again later.");
        }
      }

      if (!adminEmail || !adminPasswordHash) {
        throw new Error(
          "Admin credentials are not configured. A hashed password is required.",
        );
      }

      if (!password) {
        for (const key of throttleKeys) {
          registerFailedLoginAttempt(key);
        }
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

      if (email === adminEmail && isPasswordValid) {
        for (const key of throttleKeys) {
          clearLoginThrottle(key);
        }
        return {
          id: "admin",
          name: "Site Admin",
          email,
        };
      }

      for (const key of throttleKeys) {
        registerFailedLoginAttempt(key);
      }

      return null;
    },
  });
}

function createAuthOptions(secret: string): NextAuthOptions {
  return {
    secret,
    session: {
      strategy: "jwt",
    },
    providers: [createCredentialsProvider()],
    pages: {
      signIn: "/admin/login",
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.email = user.email;
        }
        return token;
      },
      async session({ session, token }) {
        if (token?.email && session.user) {
          session.user.email = token.email;
        }
        return session;
      },
    },
  };
}

export function getAuthOptions(): NextAuthOptions | null {
  if (!nextAuthSecret) {
    return null;
  }
  return createAuthOptions(nextAuthSecret);
}

export function requireAuthOptions(): NextAuthOptions {
  const options = getAuthOptions();
  if (!options) {
    throw new Error(NEXTAUTH_SECRET_ERROR);
  }
  return options;
}
