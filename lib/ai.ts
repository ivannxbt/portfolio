import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

function assertKey() {
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
}

// Validate API key at module load time
assertKey();

export function getOpenAIClient() {
  // API key is already validated at module load time
  return new OpenAI({ apiKey });
}

export function getModel() {
  return model;
}

