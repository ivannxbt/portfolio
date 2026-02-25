import { z } from "zod";
import { ApiErrorSchema } from "@/shared/contracts/common";

export const UploadConstraints = {
  maxFileSize: 5 * 1024 * 1024,
  allowedMimeTypes: ["image/png", "image/jpeg", "image/webp", "image/gif"] as const,
};

export const UploadResponseSchema = z.object({
  url: z.string().min(1),
});

export const UploadErrorSchema = ApiErrorSchema;

export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type UploadError = z.infer<typeof UploadErrorSchema>;
