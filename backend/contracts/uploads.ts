export const UPLOADS_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const UPLOADS_ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
] as const;

export const UPLOADS_MIME_EXTENSIONS: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export type UploadPostResponse = {
  url: string;
};

export function validateUploadFile(file: File | null): {
  ok: true;
  file: File;
} | {
  ok: false;
  error: string;
  status: number;
} {
  if (!file || typeof file.arrayBuffer !== "function") {
    return { ok: false, error: "A file is required.", status: 400 };
  }

  if (!UPLOADS_ALLOWED_TYPES.includes(file.type as (typeof UPLOADS_ALLOWED_TYPES)[number])) {
    return {
      ok: false,
      error: "Only PNG, JPEG, WebP, and GIF files are allowed.",
      status: 400,
    };
  }

  if (file.size > UPLOADS_MAX_FILE_SIZE) {
    return { ok: false, error: "File exceeds the 5 MB upload limit.", status: 413 };
  }

  return { ok: true, file };
}
