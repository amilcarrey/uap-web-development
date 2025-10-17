import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { transformOpenRouterStream } from '@/lib/stream';

const OPENROUTER_COMPLETIONS_PATH = '/chat/completions';

const roleSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return value;
}, z.enum(['user', 'assistant', 'system']));

const messageSchema = z
  .object({
    role: roleSchema,
    content: z.string().trim().min(1, 'El contenido del mensaje es requerido.'),
  })
  .strict();

const requestSchema = z
  .object({
    messages: z.array(messageSchema).min(1, 'Se requiere al menos un mensaje.'),
    model: z
      .string()
      .trim()
      .min(1, 'El identificador del modelo no puede estar vacío.')
      .optional(),
  })
  .strict();

type ValidatedMessage = z.infer<typeof messageSchema>;

type ChatRequestBody = z.infer<typeof requestSchema>;

const TAGS_TO_STRIP = ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'];

function sanitizeContent(content: string): string {
  let sanitized = content;

  for (const tag of TAGS_TO_STRIP) {
    const pattern = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
    sanitized = sanitized.replace(pattern, '');
  }

  sanitized = sanitized.replace(/<[^>]*>/g, '');
  sanitized = sanitized.replace(/javascript:/gi, '');

  return sanitized.trim();
}

function createValidationErrorResponse(message: string, issues?: unknown) {
  return NextResponse.json(
    {
      error: message,
      issues,
    },
    { status: 400 },
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL;

  if (!apiKey || !baseUrl) {
    return NextResponse.json(
      {
        error: 'El servicio no está configurado correctamente.',
      },
      { status: 500 },
    );
  }

  let payload: ChatRequestBody;

  try {
    const json = await request.json();
    const parsed = requestSchema.safeParse(json);

    if (!parsed.success) {
      return createValidationErrorResponse('El cuerpo de la solicitud es inválido.', parsed.error.flatten());
    }

    payload = parsed.data;
  } catch (error) {
    return createValidationErrorResponse('No fue posible interpretar el cuerpo de la solicitud.');
  }

  const sanitizedMessages: ValidatedMessage[] = [];

  for (let index = 0; index < payload.messages.length; index += 1) {
    const message = payload.messages[index];
    const sanitizedContent = sanitizeContent(message.content);

    if (!sanitizedContent) {
      return createValidationErrorResponse(
        `El mensaje en la posición ${index} quedó vacío tras la sanitización.`,
      );
    }

    sanitizedMessages.push({
      role: message.role,
      content: sanitizedContent,
    });
  }

  const normalizedModel = payload.model ?? 'openrouter/auto';
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  let openRouterResponse: Response;

  try {
    openRouterResponse = await fetch(`${normalizedBaseUrl}${OPENROUTER_COMPLETIONS_PATH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: normalizedModel,
        messages: sanitizedMessages,
        stream: true,
      }),
    });
  } catch (error) {
    console.error('OpenRouter request failed', error);
    return NextResponse.json(
      {
        error: 'No fue posible contactar el servicio de chat.',
      },
      { status: 500 },
    );
  }

  if (!openRouterResponse.ok || !openRouterResponse.body) {
    const errorPayload = await openRouterResponse.text().catch(() => undefined);

    return NextResponse.json(
      {
        error: 'La solicitud al servicio de chat falló.',
        details: errorPayload,
      },
      { status: 500 },
    );
  }

  const transformedStream = transformOpenRouterStream(openRouterResponse.body);

  return new Response(transformedStream, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
