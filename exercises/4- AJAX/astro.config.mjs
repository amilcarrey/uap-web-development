// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    vite: {
        plugins: [tailwindcss()],
    }
});

// En el archivo de configuración del servidor Astro
export function createAPIRoute() {
  return {
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:5173', // URL de tu aplicación React
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  }
}