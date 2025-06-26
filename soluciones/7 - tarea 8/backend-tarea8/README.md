# Proyecto Backend - Gestión de Tableros y Tareas con Autenticación y Autorización

## Descripción

Este proyecto implementa un backend robusto usando **Express.js** y **TypeORM** con una base de datos relacional para gestionar tableros y tareas con autenticación segura basada en JWT y autorización granular según permisos de usuario.

## Funcionalidades

- Registro, inicio y cierre de sesión seguro con JWT en cookies HTTPOnly
- Gestión de tableros:
  - Crear tableros
  - Visualizar solo tableros donde el usuario tiene permiso
  - Compartir tableros con diferentes niveles de acceso (propietario, editor, solo lectura)
  - Eliminar tableros (solo propietario)
- Gestión de tareas:
  - Crear, editar, eliminar, completar tareas dentro de tableros
  - Paginación, filtros por estado y búsqueda de tareas
  - Eliminación en lote de tareas completadas
- Configuración personalizada de usuario (preparada para integración frontend)
- Middleware de autenticación y autorización para proteger rutas y operaciones

## Tecnologías

- Node.js
- Express.js
- TypeScript
- TypeORM
- Base de datos relacional (configurable)
- JWT para autenticación
- Cors y cookie-parser para manejo de cookies y seguridad
- Validación con class-validator

## Instalación

1. Clonar el repositorio

```bash
git clone <tu-repo-url>
cd backend-tarea8
