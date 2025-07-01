import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      '/tasks': 'http://localhost:3001',
    },
    watch: {
      ignored: ['**/db.json'], // 👈 esto es clave
    },
  },
})