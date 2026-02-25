import { z } from "zod";
import { ApiErrorSchema, LocaleSchema } from "@/shared/contracts/common";

export const ChatRequestSchema = z.object({
  message: z.string().trim().min(1, "Message is required."),
  language: LocaleSchema.optional(),
  systemInstruction: z.string().optional(),
});

export const ChatResponseSchema = z.object({
  reply: z.string(),
});

export const ChatErrorSchema = ApiErrorSchema;

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type ChatError = z.infer<typeof ChatErrorSchema>;
