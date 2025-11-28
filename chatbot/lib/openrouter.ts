import { createOpenAI } from "@ai-sdk/openai";

/**
 * OpenRouter expone una API compatible con OpenAI.
 * Usamos createOpenAI() con baseURL = https://openrouter.ai/api/v1
 *
 * Importante: la API key NUNCA va al frontend.
 */
const baseURL = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

export const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL,
  headers: {
    ...(process.env.OPENROUTER_SITE_URL ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL } : {}),
    ...(process.env.OPENROUTER_SITE_NAME ? { "X-Title": process.env.OPENROUTER_SITE_NAME } : {})
  }
});
