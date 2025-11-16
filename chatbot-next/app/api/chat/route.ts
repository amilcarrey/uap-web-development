import { createOpenAI } from "@ai-sdk/openai";
// ¡Importamos 'streamText' desde 'ai' (el paquete core)!
import { streamText } from "ai";

export const runtime = "nodejs";

const openrouter = createOpenAI({
  baseURL: process.env.OPENROUTER_BASE_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
});

const model = process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openrouter(model),
      messages,
    });

    // ¡Devolvemos 'toTextStreamResponse' (para Texto Plano)!
    return result.toTextStreamResponse();

  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    return new Response("Error al procesar la solicitud.", { status: 500 });
  }
}
