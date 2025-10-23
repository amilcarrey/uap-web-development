import { NextRequest } from "next/server";
import { z } from "zod";
import { streamText, type CoreMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

export const runtime = "edge";

// --- Cliente OpenRouter (backend only) ---
const openai = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "UAP Chatbot",
  },
});

// --- Schema: admite string o parts[] (v5) ---
const PartSchema = z.object({
  type: z.string(),
  text: z.string().optional(),
});

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.union([z.string().min(1), z.array(PartSchema).min(1)]),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response("Invalid input", { status: 400 });
    }

    // Normalizar a CoreMessage[] (contenido texto plano)
    const messages: CoreMessage[] = parsed.data.messages.map((m) => {
      if (typeof m.content === "string") {
        return { role: m.role, content: m.content } as CoreMessage;
      }
      const text = m.content
        .filter((p) => p.type === "text")
        .map((p) => p.text ?? "")
        .join("");
      return { role: m.role, content: text } as CoreMessage;
    });

    const modelId = process.env.OPENROUTER_MODEL || "anthropic/claude-3-haiku";

    const result = await streamText({
      model: openai.chat(modelId),
      messages,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();
  } catch {
    return new Response("Server error", { status: 500 });
  }
}
