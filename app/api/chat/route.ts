import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { xai } from "@ai-sdk/xai";

const MODEL_NAME = "grok-2-1212";

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
  if (!process.env.XAI_API_KEY) {
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

    const promptParts = [];
    if (systemInstruction && typeof systemInstruction === "string") {
      promptParts.push(systemInstruction.trim());
    }
    promptParts.push(message.trim());
    const prompt = promptParts.filter(Boolean).join("\n\n");

    const result = streamText({
      model: xai(MODEL_NAME),
      prompt,
    });

    // Return the stream directly instead of buffering
    return result.toTextStreamResponse();
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
  return NextResponse.json({
    message: "Chat API endpoint. Use POST to chat with Grok.",
    usage: {
      method: "POST",
      body: {
        message: "Your conversational message",
        systemInstruction: "Optional assistant context",
      },
    },
  });
}
