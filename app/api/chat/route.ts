import { NextRequest, NextResponse } from "next/server";

import { parseChatPostRequest } from "@/backend/contracts/chat";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  createChatReply,
  getChatStatus,
  validateChatConfiguration,
} from "@/backend/services/chat-service";

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";

  const rl = checkRateLimit(ip, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please wait before sending another message." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  const config = validateChatConfiguration();
  if (!config.ok) {
    console.error("AI configuration error:", config.message);
    return NextResponse.json(
      { error: `AI service is unavailable: ${config.message}` },
      { status: 500 }
    );
  }

  try {
    const input = parseChatPostRequest(await request.json());
    if (!input.ok) {
      return NextResponse.json({ error: input.error }, { status: input.status });
    }

    const response = await createChatReply(input.message, input.language);
    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined,
    });

    return NextResponse.json(
      { error: "Unable to process your request. Please try again later." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(getChatStatus());
}
