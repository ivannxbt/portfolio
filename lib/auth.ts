import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

import { secretConfig } from "@/lib/secret-config";

const adminEmail = (secretConfig.adminEmail ?? process.env.ADMIN_EMAIL ?? "").toLowerCase();
const adminPasswordHash = secretConfig.adminPasswordHash ?? process.env.ADMIN_PASSWORD_HASH;
const adminPlainPassword = process.env.ADMIN_PASSWORD;
const nextAuthSecret = secretConfig.nextAuthSecret ?? process.env.NEXTAUTH_SECRET;

export const NEXTAUTH_SECRET_ERROR =
  "NextAuth requires a secret. Provide `nextAuthSecret` in data/secret-config.json or set the `NEXTAUTH_SECRET` environment variable.";

function createCredentialsProvider() {
  return CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toLowerCase().trim();
      const password = credentials?.password;

      if (!adminEmail || (!adminPasswordHash && !adminPlainPassword)) {
        throw new Error("Admin credentials are not configured.");
      }

      if (!password) {
        return null;
      }

      let isPasswordValid = false;
      if (adminPasswordHash) {
        isPasswordValid = await bcrypt.compare(password, adminPasswordHash);
      } else if (adminPlainPassword) {
        isPasswordValid = password === adminPlainPassword;
      }

      if (email === adminEmail && isPasswordValid) {
        return {
          id: "admin",
          name: "Site Admin",
          email,
        };
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
