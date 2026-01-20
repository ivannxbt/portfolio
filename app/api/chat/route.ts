import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { xai } from "@ai-sdk/xai";

const MODEL_NAME = "grok-2-1212";

export async function POST(request: NextRequest) {
  if (!process.env.XAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing Grok API key" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { message, systemInstruction } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { 
        error: "Unable to reach the Grok service",
        details: errorMessage,
        reply: "No response generated.",
      },
      { status: 500 }
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
