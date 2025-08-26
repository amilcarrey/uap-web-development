// Se ejecuta antes de todos los tests
import '@testing-library/jest-dom';

// Polyfill mínimo de crypto.randomUUID si no existe en JSDOM
if (!('crypto' in globalThis)) {
  // @ts-ignore
  globalThis.crypto = {} as any;
}
if (typeof globalThis.crypto.randomUUID !== 'function') {
  // @ts-ignore
  globalThis.crypto.randomUUID = () => '00000000-0000-4000-8000-000000000000';
}

/**
 * IMPORTANTE:
 * - NO usamos vi.useFakeTimers() globalmente porque rompe userEvent / findBy...
 * - Si necesitás controlar el tiempo en un test puntual, usá vi.useFakeTimers() y advanceTimersByTime dentro de ese test.
 *
 * Si querés fecha determinista sin fake timers, podés mockear Date.now en tests puntuales:
 *   vi.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-01T00:00:00Z').getTime())
 */
