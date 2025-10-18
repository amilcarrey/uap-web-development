import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFAULT_MODEL } from '@/lib/constants';
import { InMemoryRateLimiter } from '@/lib/rate-limit';
import { sanitizeHTML } from '@/lib/sanitize';
import { transformOpenRouterStream } from '@/lib/stream';
import { resolveError } from '@/lib/errors';
import { chatRequestSchema, type ChatRequestInput } from '@/lib/validation';

const OPENROUTER_COMPLETIONS_PATH = '/chat/completions';
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 20;
const rateLimiter = new InMemoryRateLimiter({ windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX });

function parseRetryAfterSeconds(rawValue: string | null): number | null {
  if (!rawValue) {
    return null;
  }

  const numeric = Number(rawValue);
  if (Number.isFinite(numeric) && numeric >= 0) {
    return Math.ceil(numeric);
  }

  const retryDate = new Date(rawValue);
  if (!Number.isNaN(retryDate.getTime())) {
    const seconds = Math.ceil((retryDate.getTime() - Date.now()) / 1000);
    return seconds > 0 ? seconds : null;
  }

  return null;
}

export async function POST(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip =
    request.ip ??
    forwardedFor?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip')?.trim() ??
    'unknown';

  const rateLimitResult = rateLimiter.touch(ip);

  if (!rateLimitResult.allowed) {
    const retryAfterSeconds = Math.max(0, Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000));
    const hasRetryAfter = Number.isFinite(retryAfterSeconds) && retryAfterSeconds >= 0;
    const retryAfterHeaderValue = hasRetryAfter ? retryAfterSeconds.toString() : null;

    const resolved = resolveError('RATE_LIMIT', {
      meta: hasRetryAfter ? { retryAfterSeconds } : undefined,
    });

    return NextResponse.json(resolved.body, {
      status: resolved.status,
      headers: {
        ...(retryAfterHeaderValue !== null ? { 'Retry-After': retryAfterHeaderValue } : {}),
      },
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL;

  if (!apiKey || !baseUrl) {
    const resolved = resolveError('CONFIGURATION');
    return NextResponse.json(resolved.body, { status: resolved.status });
  }

  let payload: ChatRequestInput;

  try {
    const json = await request.json();
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      const resolved = resolveError('VALIDATION', { meta: { issues: parsed.error.flatten() } });
      return NextResponse.json(resolved.body, { status: resolved.status });
    }

    payload = parsed.data;
  } catch (error) {
    const resolved = resolveError('VALIDATION', { meta: { reason: 'invalid_json' } });
    return NextResponse.json(resolved.body, { status: resolved.status });
  }

  const sanitizedMessages: ChatRequestInput['messages'] = [];

  for (let index = 0; index < payload.messages.length; index += 1) {
    const message = payload.messages[index];
    const sanitizedContent = sanitizeHTML(message.content).trim();

    if (!sanitizedContent) {
      const resolved = resolveError('VALIDATION', {
        meta: {
          reason: 'empty_after_sanitization',
          index,
        },
      });
      return NextResponse.json(resolved.body, { status: resolved.status });
    }

    sanitizedMessages.push({
      role: message.role,
      content: sanitizedContent,
    });
  }

  const normalizedModel = payload.model ?? DEFAULT_MODEL;
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
    const resolved = resolveError('PROVIDER', { statusOverride: 503 });
    return NextResponse.json(resolved.body, { status: resolved.status });
  }

  if (!openRouterResponse.ok || !openRouterResponse.body) {
    const errorPayload = await openRouterResponse.text().catch(() => undefined);
    console.error('OpenRouter responded with an error', {
      status: openRouterResponse.status,
      body: errorPayload,
    });

    if (openRouterResponse.status === 429) {
      const retryAfterHeader = openRouterResponse.headers.get('retry-after');
      const retryAfterSeconds = parseRetryAfterSeconds(retryAfterHeader);
      const resolvedRateLimit = resolveError('RATE_LIMIT', {
        meta: {
          source: 'provider',
          ...(retryAfterSeconds !== null ? { retryAfterSeconds } : {}),
        },
      });

      return NextResponse.json(resolvedRateLimit.body, {
        status: resolvedRateLimit.status,
        headers: {
          ...(retryAfterSeconds !== null ? { 'Retry-After': retryAfterSeconds.toString() } : {}),
        },
      });
    }

    const retryAfterHeader = openRouterResponse.headers.get('retry-after');
    const retryAfterSeconds = parseRetryAfterSeconds(retryAfterHeader);
    const statusOverride = openRouterResponse.status >= 500 ? 503 : 502;
    const resolvedProvider = resolveError('PROVIDER', {
      statusOverride,
      meta: {
        upstreamStatus: openRouterResponse.status,
        ...(retryAfterSeconds !== null ? { retryAfterSeconds } : {}),
      },
    });

    return NextResponse.json(resolvedProvider.body, {
      status: resolvedProvider.status,
      headers: {
        ...(retryAfterSeconds !== null ? { 'Retry-After': retryAfterSeconds.toString() } : {}),
      },
    });
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
