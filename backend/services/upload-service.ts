import crypto from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { API_ENDPOINTS } from "@/backend/contracts/endpoints";
import { UPLOADS_MIME_EXTENSIONS } from "@/backend/contracts/uploads";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function saveUpload(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const id =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = UPLOADS_MIME_EXTENSIONS[file.type] || ".png";
  const filename = `${id}${extension}`;
  const destination = path.join(UPLOAD_DIR, filename);

  await ensureUploadDir();
  await writeFile(destination, buffer);

  return { url: `${API_ENDPOINTS.uploads}/${filename}` };
}
