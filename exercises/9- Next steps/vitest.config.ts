// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Si querés usar alias en imports, ejemplo:
      '@components': path.resolve(__dirname, 'src/components'),
      "@": path.resolve(__dirname, "src") // esto permite usar @ como src

    },
  },
  test: {
    globals: true,            // permite usar describe, it, expect sin importarlos en cada test
    environment: 'jsdom',     // necesario para React y testing-library
    setupFiles: './src/setupTests.ts', // aquí cargamos tu setupTests.ts automáticamente
    include: ['src/tests/**/*.test.{ts,tsx}'], // solo busca archivos de test
    watch: false,
  },
});
