import { z } from "zod";
import { ApiErrorSchema, LocaleSchema } from "@/shared/contracts/common";

const JsonObjectSchema = z
  .unknown()
  .refine((value) => typeof value === "object" && value !== null && !Array.isArray(value), {
    message: "Expected an object payload.",
  });

export const ContentQuerySchema = z.object({
  lang: LocaleSchema.optional(),
});

export const ContentGetResponseSchema = z.object({
  data: z.unknown(),
});

export const ContentUpdateRequestSchema = z.object({
  lang: LocaleSchema,
  content: JsonObjectSchema,
});

export const ContentUpdateResponseSchema = ContentGetResponseSchema;

export const ContentErrorSchema = ApiErrorSchema;

export type ContentQuery = z.infer<typeof ContentQuerySchema>;
export type ContentGetResponse = z.infer<typeof ContentGetResponseSchema>;
export type ContentUpdateRequest = z.infer<typeof ContentUpdateRequestSchema>;
export type ContentUpdateResponse = z.infer<typeof ContentUpdateResponseSchema>;
export type ContentError = z.infer<typeof ContentErrorSchema>;
