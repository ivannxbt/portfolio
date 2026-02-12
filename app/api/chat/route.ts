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

export async function POST(request: NextRequest) {
  // Check if AI provider is configured
  if (!isAIConfigured()) {
    const validation = validateGoogleAPIKey();
    console.error("AI configuration error:", validation.message);
    return NextResponse.json(
      { error: `AI service is unavailable: ${validation.message}` },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message, language = "en" } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string." },
        { status: 400 }
      );
    }

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
      { status: 500 }
    );
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
