import { MAX_MESSAGE_CHARS, sanitizeText } from "@/lib/sanitize";

export { MAX_MESSAGE_CHARS, sanitizeText };

// --- Rate limiting (demo / in-memory)
// En producción: usar Redis/Upstash, etc.
type Bucket = { count: number; resetAt: number };

const WINDOW_MS = 60_000;
const MAX_REQ_PER_WINDOW = 20;

const buckets = new Map<string, Bucket>();

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const first = forwarded.split(",")[0]?.trim();
  return first || "unknown";
}

export function rateLimit(ip: string): { ok: boolean; remaining: number; resetAt: number } {
  const key = ip || "unknown";
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + WINDOW_MS;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: MAX_REQ_PER_WINDOW - 1, resetAt };
  }

  if (existing.count >= MAX_REQ_PER_WINDOW) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: MAX_REQ_PER_WINDOW - existing.count, resetAt: existing.resetAt };
}

/**
 * Aplica sanitización + validaciones simples al input del usuario.
 * Importante: se usa en backend ANTES de mandar a LLM.
 */
export function validateUserText(raw: string): { ok: true; value: string } | { ok: false; reason: string } {
  const value = sanitizeText(raw);

  if (!value) return { ok: false, reason: "El mensaje está vacío." };
  if (value.length > MAX_MESSAGE_CHARS) return { ok: false, reason: `Máximo ${MAX_MESSAGE_CHARS} caracteres.` };

  return { ok: true, value };
}
