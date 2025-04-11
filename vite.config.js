import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  root: './src', // Cambia esto si tu estructura de carpetas es diferente
  server: {
    port: 3000, // Puerto donde correrá tu servidor
  },
  plugins: [
    tailwindcss(),
  ],
});