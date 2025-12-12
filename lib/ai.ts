import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

function assertKey() {
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }
}

export function getOpenAIClient() {
  assertKey();
  return new OpenAI({ apiKey });
}

export function getModel() {
  return model;
}

