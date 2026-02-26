import { serverEnv } from "@/lib/env/server";

export type SecretConfig = {
  adminEmail?: string;
  adminPasswordHash?: string;
  databaseUrl?: string;
  nextAuthSecret?: string;
};

export const secretConfig: SecretConfig = {
  adminEmail: serverEnv.adminEmail,
  adminPasswordHash: serverEnv.adminPasswordHash,
  databaseUrl: serverEnv.databaseUrl,
  nextAuthSecret: serverEnv.nextAuthSecret,
};

export function getDatabaseUrl(): string | undefined {
  return secretConfig.databaseUrl;
}
