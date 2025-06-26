import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  resolve: {
    // Por si acaso: asegura que importe .js y .jsx
    extensions: ['.js', '.jsx']
  }
});
