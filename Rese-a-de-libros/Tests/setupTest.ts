import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        items: [
          {
            id: '1',
            volumeInfo: {
              title: 'Libro 1',
              authors: ['Autor 1'],
              description: 'Descripción del libro',
              imageLinks: { thumbnail: 'thumb.jpg' },
            },
          },
        ],
      }),
  })
) as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });
