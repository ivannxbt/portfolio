import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    // This is a placeholder implementation
    // In a real application, you would integrate with an AI service for summarization
    const wordCount = text.split(/\s+/).length;
    const summary = {
      original_length: text.length,
      word_count: wordCount,
      summary: `This text contains ${wordCount} words. In production, this would provide an AI-generated summary.`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
