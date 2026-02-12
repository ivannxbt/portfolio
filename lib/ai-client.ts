import { GoogleGenerativeAI } from "@google/generative-ai";

// AI Provider Configuration
export type AIProvider = "gemini";

const AI_PROVIDER = "gemini" as const;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Model configurations
const MODELS = {
  gemini: "gemini-2.0-flash",
} as const;

// Initialize Gemini client (lazy initialization)
let geminiClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI {
  if (!GOOGLE_API_KEY) {
    throw new Error(
      "GOOGLE_API_KEY environment variable is required. Please check your .env.local file."
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
 * Generate a complete AI response (non-streaming)
 */
export async function generateAIResponse(
  config: StreamConfig
): Promise<string> {
  const systemInstruction = config.systemInstruction || "";
  const maxTokens = config.maxTokens || 1024;

  const client = getGeminiClient();
  const model = client.getGenerativeModel({
    model: MODELS.gemini,
    systemInstruction: systemInstruction || undefined,
    generationConfig: {
      maxOutputTokens: maxTokens,
    },
  });

  try {
    const result = await withTimeout(
      model.generateContent(config.message),
      30000,
      "Gemini API request timed out after 30 seconds"
    );

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return text;
  } catch (error: unknown) {
    console.error("Gemini generation error:", {
      error,
      message: error instanceof Error ? error.message : String(error),
      config: { model: MODELS.gemini, messageLength: config.message.length },
    });
    throw error;
  }
}

/**
 * Promise timeout helper
 */
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
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
        // Add 30-second timeout to Gemini API call
        const result = await withTimeout(
          model.generateContentStream(config.message),
          30000,
          "Gemini API request timed out after 30 seconds"
        );

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }

        controller.close();
      } catch (error: unknown) {
        console.error("Gemini streaming error:", {
          error,
          message: error instanceof Error ? error.message : String(error),
          config: { model: MODELS.gemini, messageLength: config.message.length },
        });
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

/**
 * Validate Google API key format
 */
export function validateGoogleAPIKey(): {
  valid: boolean;
  message: string;
} {
  if (!GOOGLE_API_KEY) {
    return { valid: false, message: "GOOGLE_API_KEY is not set" };
  }

  // Google API keys typically start with "AIza" and are 39-43 characters
  if (!GOOGLE_API_KEY.startsWith("AIza")) {
    return {
      valid: false,
      message: "GOOGLE_API_KEY format appears invalid (should start with 'AIza')",
    };
  }

  if (GOOGLE_API_KEY.length < 39 || GOOGLE_API_KEY.length > 43) {
    return {
      valid: false,
      message: `GOOGLE_API_KEY length is ${GOOGLE_API_KEY.length}, expected 39-43`,
    };
  }

  return { valid: true, message: "API key format is valid" };
}
