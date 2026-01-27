import { NextRequest, NextResponse } from "next/server";
import {
  streamAIResponse,
  isAIConfigured,
  getAIProvider,
  getModelName,
} from "@/lib/ai-client";

export async function POST(request: NextRequest) {
  // Check if AI provider is configured
  if (!isAIConfigured()) {
    return NextResponse.json(
      { error: "AI service is unavailable. Please contact the administrator." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message, systemInstruction } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string." },
        { status: 400 }
      );
    }

    // Get the stream from the provider
    const stream = await streamAIResponse({
      message,
      systemInstruction:
        typeof systemInstruction === "string" ? systemInstruction : undefined,
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

  return NextResponse.json({
    message: `Chat API endpoint. Use POST to chat with Gemini.`,
    provider,
    model,
    usage: {
      method: "POST",
      body: {
        message: "Your conversational message",
        systemInstruction: "Optional assistant context",
      },
    },
  });
}
