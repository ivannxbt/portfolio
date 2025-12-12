import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD;

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

        if (!adminEmail || !adminPassword) {
          throw new Error("Admin credentials are not configured.");
        }

        if (email === adminEmail && password === adminPassword) {
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
