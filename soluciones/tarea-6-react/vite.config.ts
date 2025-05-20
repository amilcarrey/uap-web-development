// Importa la función defineConfig desde Vite, que ayuda a definir la configuración con autocompletado y validaciones
import { defineConfig } from "vite";

// Importa el plugin oficial de React para Vite, que habilita funcionalidades como Fast Refresh y soporte JSX
import react from "@vitejs/plugin-react";

// Importa el plugin oficial de Tailwind CSS para Vite, que permite procesar clases Tailwind durante la compilación
import tailwindcss from "@tailwindcss/vite";

// Exporta la configuración de Vite usando defineConfig para aprovechar ventajas de tipado y autocompletado
export default defineConfig({
  // Define los plugins que Vite debe usar durante el build y desarrollo
  plugins: [
    react(),      // Plugin para integrar React en Vite
    tailwindcss() // Plugin para integrar Tailwind CSS en Vite
  ],
});
