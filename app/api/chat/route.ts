import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // This is a placeholder implementation
    // In a real application, you would integrate with an AI service like OpenAI
    const response = {
      reply: `Thank you for your message: "${message}". This is a placeholder response. In production, this would be connected to an AI service.`,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Chat API endpoint. Use POST to send messages.",
    usage: {
      method: "POST",
      body: { message: "Your message here" },
    },
  });
}
