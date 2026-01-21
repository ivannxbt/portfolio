import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

import { secretConfig } from "@/lib/secret-config";

const adminEmail = (secretConfig.adminEmail ?? process.env.ADMIN_EMAIL ?? "").toLowerCase();
const adminPasswordHash = secretConfig.adminPasswordHash ?? process.env.ADMIN_PASSWORD_HASH;
const nextAuthSecret = secretConfig.nextAuthSecret ?? process.env.NEXTAUTH_SECRET;

export const NEXTAUTH_SECRET_ERROR =
  "NextAuth requires a secret. Provide `nextAuthSecret` in data/secret-config.json or set the `NEXTAUTH_SECRET` environment variable.";

/**
 * Creates a NextAuth credentials provider that authenticates a single admin account.
 *
 * The provider accepts `email` and `password` fields and validates the password
 * against the configured admin password hash.
 *
 * @returns A configured CredentialsProvider whose `authorize` method returns an admin user object `{ id: "admin", name: "Site Admin", email }` on successful authentication or `null` on failure.
 * @throws Error if the admin email or admin password hash are not configured.
 */
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

      if (!adminEmail || !adminPasswordHash) {
        throw new Error("Admin credentials are not configured. A hashed password is required.");
      }

      if (!password) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, adminPasswordHash);

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