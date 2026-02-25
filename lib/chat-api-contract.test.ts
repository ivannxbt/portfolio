import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

describe("/api/chat contract", () => {
  it("returns { reply } and callAIAssistant consumes the same JSON shape", async () => {
    vi.resetModules();

    vi.doMock("@/lib/ai-client", () => ({
      streamAIResponse: vi.fn(async () =>
        new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode("Hello "));
            controller.enqueue(new TextEncoder().encode("from API"));
            controller.close();
          },
        })
      ),
      isAIConfigured: vi.fn(() => true),
      getAIProvider: vi.fn(() => "google"),
      getModelName: vi.fn(() => "gemini"),
      validateGoogleAPIKey: vi.fn(() => ({ valid: true, message: "ok" })),
    }));

    vi.doMock("@/lib/rate-limit", () => ({
      checkRateLimit: vi.fn(() => ({ ok: true, retryAfter: 0 })),
    }));

    const { POST } = await import("@/app/api/chat/route");

    const request = new NextRequest("http://localhost/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message: "Hi there", language: "en" }),
    });

    const routeResponse = await POST(request);
    const payload = (await routeResponse.json()) as { reply?: string };

    expect(payload).toEqual({ reply: "Hello from API" });

    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify(payload), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const { callAIAssistant } = await import("@/lib/chat-fallbacks");
    const consumerText = await callAIAssistant({
      prompt: "Test",
      language: "en",
      fallback: () => "fallback",
    });

    expect(consumerText).toBe("Hello from API");
  });
});
