import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // vite.config.js
  server: {
    proxy: {
      '/api': 'http://localhost:4321'
    }
  }
})
