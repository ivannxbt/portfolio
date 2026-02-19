export type SecretConfig = {
  adminEmail?: string;
  adminPasswordHash?: string;
  databaseUrl?: string;
  nextAuthSecret?: string;
};

export const secretConfig: SecretConfig = {
  adminEmail: process.env.ADMIN_EMAIL,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  databaseUrl: process.env.DATABASE_URL,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
};

export function getDatabaseUrl(): string | undefined {
  return secretConfig.databaseUrl;
}
