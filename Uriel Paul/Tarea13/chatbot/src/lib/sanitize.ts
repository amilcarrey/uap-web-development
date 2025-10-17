import DOMPurify from 'dompurify';

/**
 * Sanitises HTML strings before rendering them in the UI.
 * TODO: Provide an isomorphic implementation that works on the server without DOM globals.
 */
export function sanitizeHTML(dirty: string): string {
  if (!dirty) {
    return '';
  }

  if (typeof window !== 'undefined' && DOMPurify) {
    return DOMPurify.sanitize(dirty);
  }

  // Fallback for environments where DOMPurify cannot be initialised (e.g. SSR tests).
  return dirty.replace(/[<>]/g, '');
}
