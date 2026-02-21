import { NextRequest, NextResponse } from "next/server";
import {
  generateAIResponse,
  isAIConfigured,
  validateGoogleAPIKey,
} from "@/lib/ai-client";

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
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // Generate real summary using Gemini
    const summaryText = await generateAIResponse({
      message: `Please provide a concise summary of the following text:\n\n${text}`,
      systemInstruction:
        "You are a helpful assistant that specializes in summarizing content accurately and concisely.",
      maxTokens: 500, // Limit summary length
    });

    const wordCount = text.split(/\s+/).length;
    const summary = {
      original_length: text.length,
      word_count: wordCount,
      summary: summaryText,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(summary);
  } catch (error: unknown) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      { error: "Unable to generate summary. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Summarize API endpoint. Use POST to summarize text.",
    usage: {
      method: "POST",
      body: { text: "Your text to summarize here" },
    },
  });
}
