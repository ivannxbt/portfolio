#!/usr/bin/env node

import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

const CONFIG_PATH = path.join(process.cwd(), "data", "secret-config.json");

function showUsage() {
  const usage = `
Usage: node scripts/manage-secret-config.mjs [options]

Options:
  --admin-email=<email>         Set or update the admin email address.
  --password=<plain-text>       Hash and store a new admin password.
  --password-hash=<hash>        Store an existing bcrypt hash directly.
  --database-url=<connection>   Persist your database connection string.
  --nextauth-secret=<secret>    Store a NextAuth secret so the frontend can reuse it.
  --cost=<number>               Optional bcrypt work factor (defaults to 10 when hashing).

You can provide as many options as you need in a single run. Use this command whenever you need to rotate admin credentials or restore your database secret store.
`;
  console.log(usage.trim());
}

function parseArgs() {
  const args = {};
  for (const token of process.argv.slice(2)) {
    if (token === "--help" || token === "-h") {
      showUsage();
      process.exit(0);
    }

    const match = token.match(/^--([^=]+)=(.*)$/);
    if (!match) {
      console.error(`Unknown argument: ${token}`);
      showUsage();
      process.exit(1);
    }

    args[match[1]] = match[2];
  }
  return args;
}

function loadExistingConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {};
  }

  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    return raw.trim() ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("Unable to read the existing secret config;", error.message);
    return {};
  }
}

function saveConfig(config) {
  const dir = path.dirname(CONFIG_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n", "utf-8");
}

async function main() {
  const options = parseArgs();
  if (
    !options["admin-email"] &&
    !options.password &&
    !options["password-hash"] &&
    !options["database-url"] &&
    !options["nextauth-secret"]
  ) {
    console.error("No valid option provided.");
    showUsage();
    process.exit(1);
  }

  const existingConfig = loadExistingConfig();
  const updatedConfig = { ...existingConfig };

  if (options["admin-email"]) {
    updatedConfig.adminEmail = options["admin-email"].toLowerCase();
  }

  if (options.password) {
    const cost = Number(options["cost"]) || 10;
    updatedConfig.adminPasswordHash = bcrypt.hashSync(options.password, cost);
  } else if (options["password-hash"]) {
    updatedConfig.adminPasswordHash = options["password-hash"];
  }

  if (options["database-url"]) {
    updatedConfig.databaseUrl = options["database-url"];
  }

  if (options["nextauth-secret"]) {
    updatedConfig.nextAuthSecret = options["nextauth-secret"];
  }

  saveConfig(updatedConfig);
  console.log(`Secret config updated at data/secret-config.json${options.password ? " (password hashed)" : ""}`);
}

main().catch((error) => {
  console.error("Secret config helper failed:", error);
  process.exit(1);
});
