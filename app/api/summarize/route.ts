import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateText, isAIConfigured } from "@/lib/ai-client";
import { getClientIp } from "@/lib/client-ip";

const MAX_INPUT_LENGTH = 8000;
const SUMMARIZE_SYSTEM =
  "You are a summarization assistant. Summarize the following text concisely in 1-3 sentences. Preserve key facts. Output only the summary, no preamble or quotes.";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const rl = await checkRateLimit(ip, { limit: 30, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      {
        error: "Too many summarize requests. Please wait before trying again.",
      },
      {
        status: 429,
        headers: rl.retryAfter
          ? { "Retry-After": String(rl.retryAfter) }
          : undefined,
      },
    );
  }

  try {
    const body = await request.json();
    const { text } = body;

    if (text === undefined || text === null) {
      return NextResponse.json(
        {
          error:
            'Missing field: text. Send a JSON body with { text: "your text to summarize" }.',
        },
        { status: 400 },
      );
    }

    if (typeof text !== "string") {
      return NextResponse.json(
        { error: "Field 'text' must be a string." },
        { status: 400 },
      );
    }

    const trimmed = text.trim();
    if (!trimmed) {
      return NextResponse.json(
        { error: "Field 'text' cannot be empty." },
        { status: 400 },
      );
    }

    if (trimmed.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text is too long. Maximum ${MAX_INPUT_LENGTH} characters allowed; received ${trimmed.length}.`,
        },
        { status: 400 },
      );
    }

    if (!isAIConfigured()) {
      return NextResponse.json(
        {
          error:
            "Summarization is unavailable: AI service is not configured (GOOGLE_API_KEY).",
        },
        { status: 503 },
      );
    }

    const summary = await generateText({
      message: trimmed,
      systemInstruction: SUMMARIZE_SYSTEM,
      maxTokens: 256,
    });

    return NextResponse.json({
      summary: summary || "No summary generated.",
      original_length: trimmed.length,
      word_count: trimmed.split(/\s+/).filter(Boolean).length,
    });
  } catch (error: unknown) {
    console.error("Summarize API error:", error);
    return NextResponse.json(
      {
        error:
          "Summarization failed. The service may be temporarily unavailable; try again later.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Summarize API. Use POST with a JSON body to summarize text.",
    usage: {
      method: "POST",
      body: {
        text: "Your text to summarize (string, max 8000 characters).",
      },
    },
    limits: {
      max_input_length: MAX_INPUT_LENGTH,
      rate_limit: "30 requests per 10 minutes per IP",
    },
  });
}
