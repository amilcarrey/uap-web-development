import { defineConfig } from 'vitest/config';
     import react from '@vitejs/plugin-react';

     export default defineConfig({
       plugins: [react()],
       test: {
         environment: 'jsdom', // Para simular un navegador
         setupFiles: './vitest.setup.ts', // Archivo de configuración
         globals: true, // Habilita globals como describe, it, expect
         coverage: {
           provider: 'v8',
           reporter: ['text', 'html'],
         },
       },
     });