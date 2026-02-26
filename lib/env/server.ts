import "server-only";

export const serverEnv = {
  adminEmail: process.env.ADMIN_EMAIL,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  databaseUrl: process.env.DATABASE_URL,
  googleApiKey: process.env.GOOGLE_API_KEY,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
} as const;
