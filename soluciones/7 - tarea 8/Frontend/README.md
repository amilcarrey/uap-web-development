# Proyecto Frontend - Gestión de Tableros y Tareas con React

## Descripción

Aplicación frontend desarrollada en **React** y **TypeScript** que consume un backend REST para gestionar tableros y tareas con autenticación segura y autorización granular.

## Funcionalidades

- Registro e inicio de sesión con manejo de sesiones usando cookies HTTPOnly
- Visualización de tableros donde el usuario tiene permisos
- Crear nuevos tableros
- Acceso a detalle de tableros para gestionar tareas
- Crear, editar, eliminar, completar tareas con filtros, búsqueda y paginación
- Compartir tableros con otros usuarios y asignar permisos (solo propietario)
- Página de configuración para personalizar la experiencia del usuario
- Redirección automática según estado de autenticación
- Manejo de errores y mensajes de validación amigables

## Tecnologías

- React 18+
- TypeScript
- React Router Dom para rutas
- Fetch API para consumo del backend
- Context API para manejo global de autenticación
- CSS simple para estilos (puede ser extendido con librerías)

## Instalación

1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd frontend
