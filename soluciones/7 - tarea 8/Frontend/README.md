# React + TypeScript + Vite
<!-- Título del proyecto: indica que se trata de una plantilla con React, TypeScript y Vite -->

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
<!-- Explicación general: esta plantilla ofrece una configuración mínima para trabajar con React en Vite, incluyendo recarga en caliente (Hot Module Replacement - HMR) y reglas de ESLint -->

Currently, two official plugins are available:
<!-- Se listan los plugins oficiales disponibles actualmente para integrar React con Vite -->

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
  <!-- Este plugin usa Babel para lograr Fast Refresh (actualización rápida de componentes) -->
  
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
  <!-- Este plugin usa SWC, un compilador rápido alternativo a Babel, también para Fast Refresh -->

## Expanding the ESLint configuration
<!-- Sección que explica cómo expandir la configuración de ESLint -->

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:
<!-- Recomendación: para aplicaciones en producción, se sugiere usar reglas de lint que consideren los tipos de TypeScript -->

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
