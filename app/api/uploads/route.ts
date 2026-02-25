import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

import { getServerSession } from "next-auth";
import { getAuthOptions, NEXTAUTH_SECRET_ERROR } from "@/lib/auth";
import { apiError } from "@/lib/api-response";
import { UploadConstraints, UploadResponseSchema } from "@/shared/contracts";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  const authOptions = getAuthOptions();
  if (!authOptions) {
    console.error("Uploads API blocked:", NEXTAUTH_SECRET_ERROR);
    return apiError(500, NEXTAUTH_SECRET_ERROR, "AUTH_NOT_CONFIGURED");
  }
  const session = await getServerSession(authOptions);
  if (!session) {
    return apiError(401, "Unauthorized", "UNAUTHORIZED");
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof (file as File).arrayBuffer !== "function") {
    return apiError(400, "A file is required.", "MISSING_FILE");
  }

  const uploadFile = file as File;

  if (!UploadConstraints.allowedMimeTypes.includes(uploadFile.type as (typeof UploadConstraints.allowedMimeTypes)[number])) {
    return apiError(400, "Only PNG, JPEG, WebP, and GIF files are allowed.", "INVALID_FILE_TYPE");
  }

  if (uploadFile.size > UploadConstraints.maxFileSize) {
    return apiError(413, "File exceeds the 5 MB upload limit.", "FILE_TOO_LARGE");
  }

  const buffer = Buffer.from(await uploadFile.arrayBuffer());

  const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = MIME_EXTENSIONS[uploadFile.type] || ".png";
  const filename = `${id}${extension}`;
  const destination = path.join(UPLOAD_DIR, filename);

  await ensureUploadDir();
  await writeFile(destination, buffer);

  return NextResponse.json(UploadResponseSchema.parse({ url: `/api/uploads/${filename}` }));
}
