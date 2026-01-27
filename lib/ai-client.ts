import { GoogleGenerativeAI } from "@google/generative-ai";

// AI Provider Configuration
export type AIProvider = "gemini";

const AI_PROVIDER = "gemini" as const;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Model configurations
const MODELS = {
  gemini: "gemini-2.0-flash-exp",
} as const;

// Initialize Gemini client (lazy initialization)
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!GOOGLE_API_KEY) {
    throw new Error(
      "GOOGLE_API_KEY environment variable is required when using Gemini provider"
    );
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(GOOGLE_API_KEY);
  }

  return geminiClient;
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
 * Stream AI response from Gemini
 *
 * Returns a ReadableStream that can be consumed by the client
 */
export async function streamAIResponse(
  config: StreamConfig
): Promise<ReadableStream<Uint8Array>> {
  const systemInstruction = config.systemInstruction || "";
  const maxTokens = config.maxTokens || 1024;

  return streamGeminiResponse({
    message: config.message,
    systemInstruction,
    maxTokens,
  });
}

/**
 * Stream response from Gemini (Google)
 */
async function streamGeminiResponse(config: {
  message: string;
  systemInstruction: string;
  maxTokens: number;
}): Promise<ReadableStream<Uint8Array>> {
  const client = getGeminiClient();
  const encoder = new TextEncoder();
  const model = client.getGenerativeModel({
    model: MODELS.gemini,
    systemInstruction: config.systemInstruction || undefined,
  });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const result = await model.generateContentStream(config.message);

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

        controller.close();
      } catch (error: unknown) {
        console.error("Gemini streaming error:", error);
        controller.error(error);
      }
    },
  });

  return stream;
}

/**
 * Get current AI provider configuration
 */
export function getAIProvider(): AIProvider {
  return "gemini";
}

/**
 * Get model name for current provider
 */
export function getModelName(): string {
  return MODELS.gemini;
}

/**
 * Check if AI provider is properly configured
 */
export function isAIConfigured(): boolean {
  return !!GOOGLE_API_KEY;
}
