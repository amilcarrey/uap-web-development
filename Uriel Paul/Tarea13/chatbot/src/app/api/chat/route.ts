import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { DEFAULT_MODEL } from '@/lib/constants';
import { InMemoryRateLimiter } from '@/lib/rate-limit';
import { sanitizeHTML } from '@/lib/sanitize';
import { transformOpenRouterStream } from '@/lib/stream';
import { resolveError } from '@/lib/errors';
import type { ResolvedError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { chatRequestSchema, type ChatRequestInput } from '@/lib/validation';

const OPENROUTER_COMPLETIONS_PATH = '/chat/completions';
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 20;
const MAX_PAYLOAD_KB = 32;
const MAX_PAYLOAD_BYTES = MAX_PAYLOAD_KB * 1024;
const ALLOWED_ORIGINS = ['https://example.com']; // TODO: Replace with the real production origins.
const SECURITY_HEADERS: Record<string, string> = {
  'Referrer-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
};
const rateLimiter = new InMemoryRateLimiter({ windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX });
const textDecoder = new TextDecoder('utf-8', { fatal: true });

function createJsonResponse(resolved: ResolvedError, headers: Record<string, string> = {}) {
  return NextResponse.json(resolved.body, {
    status: resolved.status,
    headers: {
      ...SECURITY_HEADERS,
      Vary: 'Origin',
      ...headers,
    },
  });
}

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
  const requestStartedAt = Date.now();
  const getLatencyMs = () => Date.now() - requestStartedAt;
  const origin = request.headers.get('origin');
  const isProduction = process.env.NODE_ENV === 'production';
  const isAllowedOrigin = typeof origin === 'string' && ALLOWED_ORIGINS.includes(origin);
  const originHeaders = isAllowedOrigin && origin ? { 'Access-Control-Allow-Origin': origin } : {};
  const respond = (resolved: ResolvedError, headers: Record<string, string> = {}) =>
    createJsonResponse(resolved, { ...originHeaders, ...headers });
  const logAndRespond = (
    resolved: ResolvedError,
    headers?: Record<string, string>,
    logContext?: Record<string, unknown>,
  ) => {
    logger.error('chat_api_request_failed', {
      status: resolved.status,
      errorCode: resolved.body.error.code,
      latencyMs: getLatencyMs(),
      ...(logContext ?? {}),
    });

    return respond(resolved, headers ?? {});
  };

  if (isProduction) {
    if (!isAllowedOrigin) {
      const resolved = resolveError('VALIDATION', {
        meta: {
          reason: 'invalid_origin',
        },
      });

      return logAndRespond(resolved, undefined, { reason: 'invalid_origin' });
    }
  }

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

    return logAndRespond(
      resolved,
      {
        ...(retryAfterHeaderValue !== null ? { 'Retry-After': retryAfterHeaderValue } : {}),
      },
      {
        reason: 'rate_limit_exceeded',
        ...(hasRetryAfter ? { retryAfterSeconds } : {}),
      },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL;

  if (!apiKey || !baseUrl) {
    const resolved = resolveError('CONFIGURATION');
    return logAndRespond(resolved, undefined, { reason: 'missing_provider_configuration' });
  }

  let payload: ChatRequestInput;

  try {
    const contentLengthHeader = request.headers.get('content-length');

    if (contentLengthHeader) {
      const contentLength = Number(contentLengthHeader);

      if (Number.isFinite(contentLength) && contentLength > MAX_PAYLOAD_BYTES) {
        const resolved = resolveError('VALIDATION', {
          meta: {
            reason: 'payload_too_large',
            limitKb: MAX_PAYLOAD_KB,
          },
        });

        return logAndRespond(resolved, undefined, { reason: 'payload_too_large_header' });
      }
    }

    const rawBodyBuffer = await request.arrayBuffer();

    if (rawBodyBuffer.byteLength > MAX_PAYLOAD_BYTES) {
      const resolved = resolveError('VALIDATION', {
        meta: {
          reason: 'payload_too_large',
          limitKb: MAX_PAYLOAD_KB,
        },
      });

      return logAndRespond(resolved, undefined, { reason: 'payload_too_large_body' });
    }

    const decodedBody = textDecoder.decode(rawBodyBuffer);
    const json = JSON.parse(decodedBody);
    const parsed = chatRequestSchema.safeParse(json);

    if (!parsed.success) {
      const resolved = resolveError('VALIDATION', { meta: { issues: parsed.error.flatten() } });
      return logAndRespond(resolved, undefined, { reason: 'schema_validation_failed' });
    }

    payload = parsed.data;
  } catch (error) {
    const resolved = resolveError('VALIDATION', { meta: { reason: 'invalid_json' } });
    return logAndRespond(resolved, undefined, { reason: 'invalid_json' });
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
      return logAndRespond(resolved, undefined, { reason: 'empty_message_after_sanitization', index });
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
    const resolved = resolveError('PROVIDER', { statusOverride: 503 });
    return logAndRespond(resolved, undefined, {
      reason: 'provider_request_failed',
      errorMessage: error instanceof Error ? error.message : 'unknown_error',
    });
  }

  if (!openRouterResponse.ok || !openRouterResponse.body) {
    if (openRouterResponse.status === 429) {
      const retryAfterHeader = openRouterResponse.headers.get('retry-after');
      const retryAfterSeconds = parseRetryAfterSeconds(retryAfterHeader);
      const resolvedRateLimit = resolveError('RATE_LIMIT', {
        meta: {
          source: 'provider',
          ...(retryAfterSeconds !== null ? { retryAfterSeconds } : {}),
        },
      });

      return logAndRespond(
        resolvedRateLimit,
        {
          ...(retryAfterSeconds !== null ? { 'Retry-After': retryAfterSeconds.toString() } : {}),
        },
        {
          reason: 'provider_rate_limited',
          upstreamStatus: openRouterResponse.status,
          ...(retryAfterSeconds !== null ? { retryAfterSeconds } : {}),
        },
      );
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

    return logAndRespond(
      resolvedProvider,
      {
        ...(retryAfterSeconds !== null ? { 'Retry-After': retryAfterSeconds.toString() } : {}),
      },
      {
        reason: 'provider_response_error',
        upstreamStatus: openRouterResponse.status,
        ...(retryAfterSeconds !== null ? { retryAfterSeconds } : {}),
      },
    );
  }

  const transformedStream = transformOpenRouterStream(openRouterResponse.body);

  logger.info('chat_api_request_succeeded', {
    status: 200,
    latencyMs: getLatencyMs(),
    model: normalizedModel,
  });

  return new Response(transformedStream, {
    status: 200,
    headers: {
      ...SECURITY_HEADERS,
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      Vary: 'Origin',
      ...originHeaders,
    },
  });
}
