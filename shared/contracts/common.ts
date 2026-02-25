import { z } from "zod";

export const ApiErrorSchema = z.object({
  error: z.string(),
  code: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const LocaleSchema = z.enum(["en", "es"]);
export type ContractLocale = z.infer<typeof LocaleSchema>;
