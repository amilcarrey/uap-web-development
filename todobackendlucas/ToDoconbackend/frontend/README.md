# TodoApp Frontend

Frontend desarrollado en React con Vite, Tailwind CSS, Axios y TanStack Query para la aplicación de gestión de tareas.

## Tecnologías Utilizadas

- **React 18** - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento para aplicaciones React
- **TanStack Query** - Gestión de estado del servidor y caché
- **Axios** - Cliente HTTP para realizar peticiones a la API
- **Headless UI** - Componentes de UI accesibles y sin estilo
- **Heroicons** - Conjunto de iconos SVG

## Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`

## Características

- 🔐 **Autenticación completa** - Login, registro y manejo de sesiones
- 📋 **Gestión de tableros** - Crear, editar y eliminar tableros
- ✅ **Gestión de tareas** - CRUD completo de tareas con fechas de vencimiento
- 👥 **Colaboración** - Sistema de permisos (propietario, editor, lector)
- 🎨 **UI moderna** - Interfaz limpia y responsiva con Tailwind CSS
- ⚡ **Performance optimizada** - Caché inteligente con TanStack Query
- 📱 **Responsive** - Funciona en desktop, tablet y móvil+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
