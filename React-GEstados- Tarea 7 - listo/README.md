# uap-web-development

Este repositorio contiene el desarrollo web de la UAP.

---

## React + TypeScript + Vite

Este template proporciona una configuración mínima para usar React con Vite, HMR (Hot Module Replacement) y algunas reglas básicas de ESLint.

Actualmente, hay dos plugins oficiales disponibles:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) usa [Babel](https://babeljs.io/) para Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) usa [SWC](https://swc.rs/) para Fast Refresh.

---

## Expansión de la configuración de ESLint

Si estás desarrollando una aplicación para producción, se recomienda actualizar la configuración para habilitar reglas de linting basadas en tipos:

```js
export default tseslint.config({
  extends: [
    // Reemplaza ...tseslint.configs.recommended con:
    ...tseslint.configs.recommendedTypeChecked,
    // O usa esto para reglas más estrictas:
    ...tseslint.configs.strictTypeChecked,
    // Opcionalmente, agrega reglas estilísticas:
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
