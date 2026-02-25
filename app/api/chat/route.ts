import { NextRequest, NextResponse } from "next/server";
import {
  streamAIResponse,
  isAIConfigured,
  getAIProvider,
  getModelName,
  validateGoogleAPIKey,
} from "@/lib/ai-client";
import { defaultContent } from "@/content/site-content";
import { generateSystemPrompt } from "@/lib/chat-context";
import { Language } from "@/lib/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { apiError } from "@/lib/api-response";
import { ChatRequestSchema, ChatResponseSchema } from "@/shared/contracts";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const rl = checkRateLimit(ip, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before sending another message.", code: "RATE_LIMITED" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // Check if AI provider is configured
  if (!isAIConfigured()) {
    const validation = validateGoogleAPIKey();
    console.error("AI configuration error:", validation.message);
    return apiError(500, `AI service is unavailable: ${validation.message}`, "AI_NOT_CONFIGURED");
  }

  try {
    const body = await request.json().catch(() => null);
    const parsedBody = ChatRequestSchema.safeParse(body);
    if (!parsedBody.success) {
      return apiError(400, "Invalid request payload.", "INVALID_PAYLOAD");
    }
    const { message, language = "en" } = parsedBody.data;

    // Validate language
    const lang: Language = language === "es" ? "es" : "en";

    // Generate secure system instruction on the server
    const systemInstruction = generateSystemPrompt(defaultContent[lang], lang);

    // Get the stream from the provider
    const stream = await streamAIResponse({
      message,
      systemInstruction,
    });

    // Buffer the stream to return a single JSON response
    // This is necessary because the client components expect JSON, not a stream
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let reply = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      reply += decoder.decode(value, { stream: true });
    }
    // Flush any remaining text
    reply += decoder.decode();

    const payload = ChatResponseSchema.parse({ reply });
    return NextResponse.json(payload);
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
    });
    // Don't expose internal error details to the client
    return apiError(500, "Unable to process your request. Please try again later.", "INTERNAL_ERROR");
  }
}

export async function GET() {
  const provider = getAIProvider();
  const model = getModelName();
  const apiKeyValidation = validateGoogleAPIKey();
  const isConfigured = isAIConfigured();

  return NextResponse.json({
    status: isConfigured ? "configured" : "not_configured",
    message: `Chat API endpoint. Use POST to chat with Gemini.`,
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
  });
}
