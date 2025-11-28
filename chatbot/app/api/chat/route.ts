import { streamText, UIMessage, convertToModelMessages } from "ai";
import { z } from "zod";
import { openrouter } from "@/lib/openrouter";
import { getClientIp, rateLimit, validateUserText } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Zod schema defensivo para requests
const MessagePartSchema = z
  .object({ type: z.string() })
  .passthrough();

const UIMessageSchema = z
  .object({
    id: z.string(),
    role: z.enum(["system", "user", "assistant"]),
    parts: z.array(MessagePartSchema).default([])
  })
  .passthrough();

const BodySchema = z.object({
  messages: z.array(UIMessageSchema).max(60)
});

function sanitizeMessages(messages: UIMessage[]): UIMessage[] {
  return messages.map((m) => {
    if (m.role !== "user") return m;

    const parts = m.parts.map((p: any) => {
      if (p?.type !== "text" || typeof p.text !== "string") return p;

      const validated = validateUserText(p.text);
      if (!validated.ok) {
        // Reemplazamos por un texto seguro en lugar de fallar duro y dejar al user sin feedback.
        return { ...p, text: "" };
      }
      return { ...p, text: validated.value };
    });

    return { ...m, parts } as UIMessage;
  });
}

export async function POST(req: Request) {
  try {
    // Rate limiting (básico)
    const ip = getClientIp(req);
    const limit = rateLimit(ip);
    if (!limit.ok) {
      return Response.json(
        { error: "RATE_LIMITED", message: "Demasiadas requests. Probá de nuevo en un minuto." },
        { status: 429 }
      );
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return Response.json(
        { error: "BAD_REQUEST", message: "Body inválido." },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return Response.json(
        { error: "SERVER_MISCONFIGURED", message: "Falta OPENROUTER_API_KEY en el servidor." },
        { status: 500 }
      );
    }

    const modelName =
      process.env.OPENROUTER_MODEL ?? "meta-llama/llama-3.2-3b-instruct:free";

    // Seguridad: sanitizar inputs del usuario antes de mandar al LLM
    const uiMessages = sanitizeMessages(parsed.data.messages as UIMessage[]);

    const result = streamText({
      model: openrouter.chat(modelName),
      system:
        "Sos un asistente útil. Respondé en el mismo idioma del usuario. No inventes credenciales ni secretos. Si falta contexto, pedí aclaraciones.",
      messages: convertToModelMessages(uiMessages),
      temperature: 0.7
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    // No loguear contenido del user. Solo el error.
    console.error("api/chat error:", err);
    return Response.json(
      { error: "INTERNAL_ERROR", message: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
