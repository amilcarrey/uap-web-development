// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "src/frontend", // indica a Vite que el root del frontend está aquí
  plugins: [react()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/frontend/components"),
      "@hooks": path.resolve(__dirname, "src/frontend/hooks"),
      "@store": path.resolve(__dirname, "src/frontend/store"),
      "@types": path.resolve(__dirname, "src/frontend/types"),
      "@utils": path.resolve(__dirname, "src/frontend/utils"),
    },
  },
  server: {
    port: 4321,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "../../dist", // lo saca fuera del frontend
    emptyOutDir: true,
  },
});
