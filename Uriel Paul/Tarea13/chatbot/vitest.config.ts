import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const rootDir = dirname(fileURLToPath(new URL(import.meta.url)));

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': resolve(rootDir, 'src'),
    },
  },
});
