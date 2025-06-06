import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone', // 'standalone' o 'middleware' según tu despliegue
  }),
  vite: {
    plugins: [tailwindcss()],
    server: { port: 3000 },
  },
});
