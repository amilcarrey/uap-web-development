// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    output: 'server',
    server: {
      port: 4321, 
    },
    integrations: [],
    vite: {
      plugins: [tailwindcss()],
    },
  });