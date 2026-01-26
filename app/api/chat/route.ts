import { NextRequest, NextResponse } from "next/server";
import {
  streamAIResponse,
  isAIConfigured,
  getAIProvider,
  getModelName,
} from "@/lib/ai-client";

/**
 * Helper function to create a text stream response for error messages.
 * This ensures consistency with successful streaming responses.
 */
function createErrorStreamResponse(message: string, status: number) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(message));
      controller.close();
    },
  });

  return new NextResponse(stream, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

export async function POST(request: NextRequest) {
  // Check if AI provider is configured
  if (!isAIConfigured()) {
    return createErrorStreamResponse(
      "Error: AI service is unavailable. Please contact the administrator.",
      500
    );
  }

  try {
    const body = await request.json();
    const { message, systemInstruction } = body;

    if (!message || typeof message !== "string") {
      return createErrorStreamResponse(
        "Error: Message is required and must be a string.",
        400
      );
    }

    // Stream AI response using configured provider
    const stream = await streamAIResponse({
      message,
      systemInstruction:
        typeof systemInstruction === "string" ? systemInstruction : undefined,
    });

    // Return the stream with appropriate headers
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    // Don't expose internal error details to the client
    return createErrorStreamResponse(
      "Error: Unable to process your request. Please try again later.",
      500
    );
  }
}

export async function GET() {
  const provider = getAIProvider();
  const model = getModelName();

  return NextResponse.json({
    message: `Chat API endpoint. Use POST to chat with ${provider === "claude" ? "Claude" : "Grok"}.`,
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
