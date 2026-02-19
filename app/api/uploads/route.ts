import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

import { getServerSession } from "next-auth";
import { getAuthOptions, NEXTAUTH_SECRET_ERROR } from "@/lib/auth";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
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
    return NextResponse.json({ error: NEXTAUTH_SECRET_ERROR }, { status: 500 });
  }
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || typeof (file as File).arrayBuffer !== "function") {
    return NextResponse.json({ error: "A file is required." }, { status: 400 });
  }

  const uploadFile = file as File;

  if (!ALLOWED_TYPES.includes(uploadFile.type)) {
    return NextResponse.json({ error: "Only PNG, JPEG, WebP, and GIF files are allowed." }, { status: 400 });
  }

  if (uploadFile.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds the 5 MB upload limit." }, { status: 413 });
  }

  const buffer = Buffer.from(await uploadFile.arrayBuffer());

  const id = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = MIME_EXTENSIONS[uploadFile.type] || ".png";
  const filename = `${id}${extension}`;
  const destination = path.join(UPLOAD_DIR, filename);

  await ensureUploadDir();
  await writeFile(destination, buffer);

  return NextResponse.json({ url: `/api/uploads/${filename}` });
}
