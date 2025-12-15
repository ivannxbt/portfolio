import { existsSync, readFileSync } from "fs";
import path from "path";

export type SecretConfig = {
  adminEmail?: string;
  adminPasswordHash?: string;
  databaseUrl?: string;
  nextAuthSecret?: string;
};

const CONFIG_PATH = path.join(process.cwd(), "data", "secret-config.json");

function loadSecretConfig(): SecretConfig {
  if (!existsSync(CONFIG_PATH)) {
    return {};
  }

  try {
    const raw = readFileSync(CONFIG_PATH, "utf-8");
    if (!raw.trim()) {
      return {};
    }
    return JSON.parse(raw) as SecretConfig;
  } catch (error) {
    console.warn(
      "Unable to parse data/secret-config.json. Falling back to environment variables.",
      error instanceof Error ? error.message : String(error)
    );
    return {};
  }
}

export const secretConfig = loadSecretConfig();

export function getDatabaseUrl(): string | undefined {
  return secretConfig.databaseUrl ?? process.env.DATABASE_URL;
}
