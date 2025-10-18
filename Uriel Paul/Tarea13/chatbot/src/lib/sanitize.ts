import type { Config } from 'dompurify';
import createDOMPurify from 'isomorphic-dompurify';

const DOMPurify = createDOMPurify();

const STRICT_CONFIG: Config = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
  ALLOW_ARIA_ATTR: false,
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'link', 'meta'],
  FORBID_ATTR: ['style'],
  RETURN_TRUSTED_TYPE: false,
  KEEP_CONTENT: false,
};

const FALLBACK_ESCAPE_REGEX = /[&<>"'`]/g;

const FALLBACK_ESCAPE_LOOKUP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;',
};

function escapeWithFallback(value: string): string {
  return value.replace(FALLBACK_ESCAPE_REGEX, (match) => FALLBACK_ESCAPE_LOOKUP[match] ?? match);
}

/**
 * Sanitises HTML strings before rendering them in the UI.
 * TODO: Provide an isomorphic implementation that works on the server without DOM globals.
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) {
    return '';
  }

  try {
    return DOMPurify.sanitize(dirty, STRICT_CONFIG);
  } catch (error) {
    console.warn('Falló la sanitización con DOMPurify, usando escape de respaldo.', error);
    return escapeWithFallback(dirty);
  }
}
