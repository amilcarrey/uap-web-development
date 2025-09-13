/** @type {import('astro').AstroUserConfig} */
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  integrations: [], // Elimina la integración de Tailwind
});