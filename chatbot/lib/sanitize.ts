export const MAX_MESSAGE_CHARS = 2000;

/**
 * Sanitización ligera (defensiva):
 * - trim
 * - remove control chars (sin tocar \n o \t)
 * - limit length
 *
 * Nota: La UI renderiza texto plano (React escapa por defecto) => mitiga XSS.
 * Aun así validamos para evitar payloads abusivos.
 */
export function sanitizeText(input: string): string {
  const trimmed = (input ?? "").trim();

  // Remove most ASCII control chars except \t (0x09) and \n (0x0A)
  const withoutControls = trimmed.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
    ""
  );

  return withoutControls.slice(0, MAX_MESSAGE_CHARS);
}
