import { streamText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { tools } from "@/lib/tools";
import { rateLimiterPersistent } from "@/lib/rateLimitPersistent";
import { sanitizeInput } from "@/lib/sanitize";
import { chatRequestSchema } from "@/lib/schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting - Obtener identificador del cliente
    const ip = req.headers.get("x-forwarded-for") || 
               req.headers.get("x-real-ip") || 
               "unknown";
    
    const rateLimitResult = rateLimiterPersistent.check(ip);
    
    if (!rateLimitResult.allowed) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return new Response(
        JSON.stringify({
          error: "Too many requests",
          message: "Has excedido el límite de solicitudes. Intenta más tarde.",
          resetTime: resetDate.toISOString(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetDate.toISOString(),
          },
        }
      );
    }

    // 2. Validación con Zod
    const body = await req.json();
    const validationResult = chatRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          message: "Los datos enviados no son válidos",
          details: validationResult.error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { messages } = validationResult.data;

    // 3. Sanitización - Limpiar contenido de mensajes
    const sanitizedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content ? sanitizeInput(msg.content) : "", // Permitir content vacío
      ...(msg.id && { id: msg.id }),
      ...(msg.toolCallId && { toolCallId: msg.toolCallId }),
      ...(msg.toolInvocations && { toolInvocations: msg.toolInvocations }),
    }));

    // 4. Validación de contenido sanitizado - Solo validar mensajes de usuario
    const userMessages = sanitizedMessages.filter(msg => msg.role === "user");
    if (userMessages.some((msg) => !msg.content || msg.content.trim().length === 0)) {
      return new Response(
        JSON.stringify({
          error: "Invalid content",
          message: "Los mensajes de usuario no pueden estar vacíos",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 5. Configuración del modelo
    const openrouter = createOpenAI({
      apiKey: process.env.OPENROUTER_API_KEY!,
      baseURL: process.env.OPENROUTER_BASE_URL!,
    });

    const model = openrouter.chat(process.env.OPENROUTER_MODEL!); 

    const systemPrompt = `Eres un asistente de recomendación de libros que SIEMPRE usa las herramientas disponibles.

REGLAS CRÍTICAS:
1. Cuando el usuario pida buscar/recomendar libros → Ejecuta "searchBooks" y MUESTRA la lista completa
2. Cuando pregunte por detalles de un libro → Ejecuta "getBookDetails"
3. Cuando pida agregar a su lista → Ejecuta "addToReadingList"
4. Cuando pregunte qué tiene en su lista → Ejecuta "getReadingList"
5. Cuando marque un libro como leído → Ejecuta "markAsRead"
6. Cuando pida estadísticas o desafíos → Ejecuta "getReadingStats"

IMPORTANTE SOBRE HERRAMIENTAS:
- NUNCA muestres los parámetros internos de las herramientas (como bookId, userId, priority)
- SIEMPRE espera el resultado de la herramienta antes de responder
- Usa SOLO el mensaje devuelto por la herramienta para responder al usuario
- NO expongas detalles técnicos como IDs o estructuras JSON

CÓMO PRESENTAR RESULTADOS DE BÚSQUEDA:
Cuando searchBooks retorne libros, SIEMPRE presenta la lista completa así:

"Encontré estos libros de [tema]:

1. **[Título]** - [Autor(es)]
2. **[Título]** - [Autor(es)]
...

¿Te interesa alguno en particular? Puedo darte más detalles."

NUNCA digas solo "Estos son algunos libros" sin mostrar la lista.
SIEMPRE muestra título y autores de TODOS los libros retornados.

CÓMO PRESENTAR DESAFÍOS:
Cuando el usuario pida desafíos de lectura, ejecuta getReadingStats con el parámetro challengeType apropiado:
- Si pide "desafío del mes" o "para este mes" → usa challengeType: "month"
- Si pide "desafío del año" o "para este año" → usa challengeType: "year"
- Si pide "desafío de calidad" → usa challengeType: "quality"
- Si pide "desafío de racha" → usa challengeType: "streak"
- Si solo pide "desafíos" o "estadísticas" → usa challengeType: "all"

Los desafíos incluyen recomendaciones específicas de libros con títulos y autores reales.
Presenta los desafíos de forma clara y motivadora.
Los desafíos varían en cada llamada para dar variedad.
`;

    // 6. Streaming de respuesta
    const result = await streamText({
      model,
      tools,
      messages: [{ role: "system", content: systemPrompt }, ...sanitizedMessages],
      maxToolRoundtrips: 5,
      toolChoice: "auto", // Permitir que el modelo elija cuándo usar tools
    });

    // 7. Agregar headers de rate limit a la respuesta exitosa
    const response = result.toAIStreamResponse();
    response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
    response.headers.set("X-RateLimit-Reset", new Date(rateLimitResult.resetTime).toISOString());

    return response;
  } catch (error) {
    console.error("❌ Error en /api/chat:", error);
    
    // Manejo específico de errores de validación
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          error: "Validation error",
          message: "Error al validar los datos",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Error genérico
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Ha ocurrido un error interno. Por favor, intenta de nuevo.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
