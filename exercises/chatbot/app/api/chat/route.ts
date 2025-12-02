import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';

// ⚠️ SEGURIDAD: Validación de variables de entorno
// Las API keys NUNCA deben estar en el frontend
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY no está configurada en las variables de entorno');
}

// Configuración del cliente OpenRouter usando el provider OpenAI
// OpenRouter es compatible con la API de OpenAI
const openrouter = createOpenAI({
  apiKey: OPENROUTER_API_KEY,
  baseURL: OPENROUTER_BASE_URL,
});

// Schema de validación para el request body usando Zod
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(10000), // Limitar longitud para prevenir abuse
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50), // Limitar número de mensajes
});

// Función para sanitizar inputs del usuario
function sanitizeInput(text: string): string {
  // Remover caracteres peligrosos y limitar longitud
  return text
    .trim()
    .slice(0, 10000)
    .replace(/[<>]/g, ''); // Prevenir inyección HTML básica
}

// Rate limiting simple (en producción usar middleware dedicado)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests por minuto
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const userLimit = requestCounts.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(req: Request) {
  try {
    // Rate limiting básico
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return new Response('Too many requests', { status: 429 });
    }

    // Parsear y validar el request body
    const body = await req.json();
    
    // Validar con Zod
    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request format',
          details: validationResult.error.issues 
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { messages } = validationResult.data;

    // Sanitizar todos los mensajes
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: sanitizeInput(msg.content),
    }));

    // Validar que hay al menos un mensaje del usuario
    const hasUserMessage = sanitizedMessages.some(msg => msg.role === 'user');
    if (!hasUserMessage) {
      return new Response(
        JSON.stringify({ error: 'At least one user message is required' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Llamar al LLM con streaming
    const result = await streamText({
      // @ts-expect-error - Type mismatch between @ai-sdk/provider versions in node_modules
      model: openrouter(OPENROUTER_MODEL),
      messages: sanitizedMessages,
      maxTokens: 1000,
      temperature: 0.7,
    });

    // Convertir a Response válido para Next.js (AI SDK v3)
    return new Response(result.toDataStream(), {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    // Logging seguro (no exponer detalles sensibles)
    console.error('Error in chat API:', error instanceof Error ? error.message : 'Unknown error');
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to process chat request'
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Método OPTIONS para CORS (si es necesario)
export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
