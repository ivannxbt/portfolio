import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";

const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error("Admin credentials are not configured.");
        }

        if (!password) {
          return null;
        }

        // Use bcrypt to compare the provided password with the stored hash
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
    }),
  ],
  pages: {
    signIn: '/admin/login',
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
