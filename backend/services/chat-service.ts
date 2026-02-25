import { defaultContent } from "@/content/site-content";
import {
  getAIProvider,
  getModelName,
  isAIConfigured,
  streamAIResponse,
  validateGoogleAPIKey,
} from "@/lib/ai-client";
import { generateSystemPrompt } from "@/lib/chat-context";
import type { Language } from "@/lib/types";

export async function createChatReply(message: string, language: Language) {
  const systemInstruction = generateSystemPrompt(defaultContent[language], language);

  const stream = await streamAIResponse({
    message,
    systemInstruction,
  });

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let reply = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    reply += decoder.decode(value, { stream: true });
  }

  reply += decoder.decode();

  return { reply };
}

export function getChatStatus() {
  const provider = getAIProvider();
  const model = getModelName();
  const apiKeyValidation = validateGoogleAPIKey();
  const configured = isAIConfigured();

  return {
    status: configured ? "configured" : "not_configured",
    message: "Chat API endpoint. Use POST to chat with Gemini.",
    provider,
    model,
    apiKey: {
      set: !!process.env.GOOGLE_API_KEY,
      valid: apiKeyValidation.valid,
      message: apiKeyValidation.message,
    },
    usage: {
      method: "POST",
      body: {
        message: "Your conversational message",
        language: "en | es (optional, defaults to en)",
      },
    },
  };
}

export function validateChatConfiguration() {
  if (isAIConfigured()) {
    return { ok: true } as const;
  }

  const validation = validateGoogleAPIKey();
  return {
    ok: false,
    message: validation.message,
  } as const;
}
