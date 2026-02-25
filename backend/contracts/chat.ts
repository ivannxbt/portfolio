import type { Language } from "@/lib/types";

export type ChatPostRequest = {
  message?: string;
  language?: string;
};

export function parseChatPostRequest(input: ChatPostRequest): {
  ok: true;
  message: string;
  language: Language;
} | {
  ok: false;
  error: string;
  status: number;
} {
  if (!input.message || typeof input.message !== "string") {
    return {
      ok: false,
      error: "Message is required and must be a string.",
      status: 400,
    };
  }

  return {
    ok: true,
    message: input.message,
    language: input.language === "es" ? "es" : "en",
  };
}
