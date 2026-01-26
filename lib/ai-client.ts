import Anthropic from "@anthropic-ai/sdk";
import { xai } from "@ai-sdk/xai";
import { streamText } from "ai";

// AI Provider Configuration
export type AIProvider = "claude" | "grok";

const AI_PROVIDER = (process.env.AI_PROVIDER || "grok") as AIProvider;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const XAI_API_KEY = process.env.XAI_API_KEY;

// Model configurations
const MODELS = {
  claude: "claude-sonnet-4-5-20250929",
  grok: "grok-2-1212",
} as const;

// Initialize Anthropic client (lazy initialization)
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is required when using Claude provider"
    );
  }

  if (!anthropicClient) {
    anthropicClient = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
  }

  return anthropicClient;
}

/**
 * Configuration for AI streaming
 */
export interface StreamConfig {
  provider?: AIProvider;
  message: string;
  systemInstruction?: string;
  maxTokens?: number;
}

/**
 * Unified streaming interface for both Claude and Grok
 *
 * Returns a ReadableStream that can be consumed by the client
 */
export async function streamAIResponse(
  config: StreamConfig
): Promise<ReadableStream<Uint8Array>> {
  const provider = config.provider || AI_PROVIDER;
  const systemInstruction = config.systemInstruction || "";
  const maxTokens = config.maxTokens || 1024;

  if (provider === "claude") {
    return streamClaudeResponse({
      message: config.message,
      systemInstruction,
      maxTokens,
    });
  } else {
    return streamGrokResponse({
      message: config.message,
      systemInstruction,
      maxTokens,
    });
  }
}

/**
 * Stream response from Claude (Anthropic)
 */
async function streamClaudeResponse(config: {
  message: string;
  systemInstruction: string;
  maxTokens: number;
}): Promise<ReadableStream<Uint8Array>> {
  const client = getAnthropicClient();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: MODELS.claude,
          max_tokens: config.maxTokens,
          system: config.systemInstruction || undefined,
          messages: [
            {
              role: "user",
              content: config.message,
            },
          ],
        });

        claudeStream.on("text", (text) => {
          controller.enqueue(encoder.encode(text));
        });

        claudeStream.on("error", (error) => {
          console.error("Claude streaming error:", error);
          controller.error(error);
        });

        await claudeStream.finalMessage();
        controller.close();
      } catch (error: unknown) {
        console.error("Claude API error:", error);
        controller.error(error);
      }
    },
  });

  return stream;
}

/**
 * Stream response from Grok (xAI) using Vercel AI SDK
 */
async function streamGrokResponse(config: {
  message: string;
  systemInstruction: string;
  maxTokens: number;
}): Promise<ReadableStream<Uint8Array>> {
  if (!XAI_API_KEY) {
    throw new Error(
      "XAI_API_KEY environment variable is required when using Grok provider"
    );
  }

  const promptParts = [];
  if (config.systemInstruction) {
    promptParts.push(config.systemInstruction.trim());
  }
  promptParts.push(config.message.trim());
  const prompt = promptParts.filter(Boolean).join("\n\n");

  const result = streamText({
    model: xai(MODELS.grok),
    prompt,
  });

  return result.toTextStreamResponse().body!;
}

/**
 * Get current AI provider configuration
 */
export function getAIProvider(): AIProvider {
  return AI_PROVIDER;
}

/**
 * Get model name for current provider
 */
export function getModelName(provider?: AIProvider): string {
  const activeProvider = provider || AI_PROVIDER;
  return MODELS[activeProvider];
}

/**
 * Check if AI provider is properly configured
 */
export function isAIConfigured(provider?: AIProvider): boolean {
  const activeProvider = provider || AI_PROVIDER;

  if (activeProvider === "claude") {
    return !!ANTHROPIC_API_KEY;
  } else {
    return !!XAI_API_KEY;
  }
}
