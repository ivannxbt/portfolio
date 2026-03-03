import { NextRequest, NextResponse } from "next/server";
import {
  streamAIResponse,
  isAIConfigured,
  validateGoogleAPIKey,
} from "@/lib/ai-client";
import { defaultContent } from "@/content/site-content";
import { generateSystemPrompt } from "@/lib/chat-context";
import { Language } from "@/lib/types";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rl = await checkRateLimit(ip, { limit: 20, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait before sending another message.",
      },
      {
        status: 429,
        headers: rl.retryAfter
          ? { "Retry-After": String(rl.retryAfter) }
          : undefined,
      },
    );
  }

  // Check if AI provider is configured
  if (!isAIConfigured()) {
    const validation = validateGoogleAPIKey();
    console.error("AI configuration error:", validation.message);
    return NextResponse.json(
      { error: `AI service is unavailable: ${validation.message}` },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const { message, language = "en" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string." },
        { status: 400 },
      );
    }

    // Validate language
    const lang: Language = language === "es" ? "es" : "en";

    // System prompt is generated only on the server (client must not send systemInstruction).
    // See generateSystemPrompt in lib/chat-context.ts.
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

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
    });
    // Don't expose internal error details to the client
    return NextResponse.json(
      { error: "Unable to process your request. Please try again later." },
      { status: 500 },
    );
  }
}

export async function GET() {
  const isConfigured = isAIConfigured();
  const isProduction = process.env.NODE_ENV === "production";

  const baseResponse = {
    status: isConfigured ? "configured" : "not_configured",
    message: "Chat API endpoint. Use POST to chat.",
    usage: {
      method: "POST",
      body: {
        message: "Your conversational message",
        language: "en | es (optional, defaults to en)",
      },
    },
  };

  if (isProduction) {
    return NextResponse.json(baseResponse);
  }

  const apiKeyValidation = validateGoogleAPIKey();
  return NextResponse.json({
    ...baseResponse,
    debug: {
      provider: "gemini",
      model: "gemini-2.0-flash",
      apiKey: {
        set: !!process.env.GOOGLE_API_KEY,
        valid: apiKeyValidation.valid,
        message: apiKeyValidation.message,
      },
    },
  });
}
