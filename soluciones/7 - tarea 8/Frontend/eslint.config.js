// Importa la configuración recomendada básica de ESLint para JavaScript
import js from '@eslint/js'

// Importa definiciones de variables globales para distintos entornos (como browser o Node.js)
import globals from 'globals'

// Importa el plugin de ESLint para manejar las reglas de los hooks de React
import reactHooks from 'eslint-plugin-react-hooks'

// Importa el plugin para habilitar y verificar el correcto uso de React Refresh (Hot Module Reloading)
import reactRefresh from 'eslint-plugin-react-refresh'

// Importa utilidades para trabajar con ESLint y TypeScript
import tseslint from 'typescript-eslint'

// Exporta la configuración de ESLint usando el helper `tseslint.config`, que permite usar TypeScript con ESLint
export default tseslint.config(
  // Primer objeto: configuración general de ESLint
  {
    // Ignora la carpeta 'dist', que usualmente contiene archivos generados y no debe ser analizada
    ignores: ['dist'],
  },
  // Segundo objeto: configuración específica del análisis de código
  {
    // Usa las reglas recomendadas para JavaScript y TypeScript
    extends: [js.configs.recommended, ...tseslint.configs.recommended],

    // Aplica esta configuración solo a archivos `.ts` y `.tsx`
    files: ['**/*.{ts,tsx}'],

    // Configura opciones del lenguaje
    languageOptions: {
      ecmaVersion: 2020, // Usa la versión de ECMAScript 2020
      globals: globals.browser, // Define variables globales del entorno navegador (como window, document, etc.)
    },

    // Define los plugins que se van a usar
    plugins: {
      'react-hooks': reactHooks,       // Plugin para verificar el uso correcto de hooks de React
      'react-refresh': reactRefresh,   // Plugin para permitir exportaciones compatibles con React Refresh
    },

    // Define reglas personalizadas o activadas desde los plugins
    rules: {
      // Usa las reglas recomendadas del plugin react-hooks
      ...reactHooks.configs.recommended.rules,

      // Muestra advertencia si se exporta un componente de forma no compatible con React Refresh,
      // pero permite exportaciones constantes (como `export const Componente = () => {}`)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
