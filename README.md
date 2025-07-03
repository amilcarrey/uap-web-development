# 🗂️ Gestor de Tareas — Full Stack con Autenticación y Autorización

Este es un sistema completo de gestión de tareas desarrollado con **React + Zustand + TanStack Query** en el frontend, y **Express.js + SQLite + JWT** en el backend. 

Permite gestionar tableros de tareas compartidos, con múltiples niveles de permisos y configuraciones personalizadas.

---

## 🚀 Características principales

### ✅ Autenticación y Autorización
- Registro e inicio de sesión seguros con contraseñas hasheadas.
- JWT almacenado en cookies HTTP-only.
- Cierre de sesión seguro.
- Rutas protegidas según autenticación y permisos.
- Middleware para autorización por roles.


### ✅ Sistema de Tableros
- Los usuarios pueden crear múltiples tableros.
- Cada tablero tiene un propietario.
- Compartición de tableros con permisos: **propietario**, **editor**, **solo lectura**.
- Eliminación y edición solo por propietarios.

### ✅ Gestión de Tareas
- Crear, editar, eliminar, marcar tareas como completadas.
- Filtrado por estado (todas, incompletas, completadas).
- Paginación por tablero.
- Búsqueda y limpieza masiva de tareas completadas.

### ✅ Configuración de Usuario
- Intervalo de actualización automático configurable.
- Mostrar descripciones en mayúsculas.
- Configuración persistente entre sesiones.

### ✅ Frontend UI
- Totalmente responsivo.
- Estética minimalista y clara.
- Soporte para notificaciones visuales (toasts).
- Navegación protegida y fluida.

---

## 🛠️ Tecnologías utilizadas

### 🧠 Frontend
- React 19
- Zustand (gestión de estado)
- TanStack React Query
- React Router DOM
- React Toastify
- Tailwind CSS

### ⚙️ Backend
- Express.js
- SQLite (vía `sqlite3`)
- JWT
- bcrypt
- CORS + middlewares personalizados

---

## 🧪 Cómo ejecutar el proyecto

### 1. Clona el repositorio
- bash

git clone (link del git a clonar, ejemplo: https://github.com/blomer52/tarea8-advanced-backend)
cd gestor-tareas

### 2. Instala dependencias
npm install

### 3. Inicializa la base de datos
node backend/initDB.js # Solo la primera vez:

### 4. Ejecuta la app (Frontend + Backend) ya que tengo un comando personalizado
npm run dev

# 🚀 Endpoints de la API (resumen)

## Auth
-> POST /api/auth/register — Registrar usuario

-> POST /api/auth/login — Iniciar sesión

-> POST /api/auth/logout — Cerrar sesión

-> GET /api/auth/me — Usuario actual

## Boards
-> GET /api/boards — Obtener tableros del usuario

-> POST /api/boards — Crear nuevo tablero

-> DELETE /api/boards/:id — Eliminar tablero (solo propietario)

-> POST /api/boards/:id/share — Compartir tablero con otro usuario

-> GET /api/boards/:id/permissions — Consultar permisos

-> DELETE /api/boards/:id/permissions/:userId — Revocar acceso

## Tasks
-> GET /api/tasks?board=ID&page=1&limit=5 — Obtener tareas paginadas

-> POST /api/tasks — Crear tarea

-> PUT /api/tasks/:id — Editar tarea

-> DELETE /api/tasks/:id — Eliminar tarea

-> PATCH /api/tasks/:id — Marcar como completada/incompleta

-> DELETE /api/tasks?board=ID&completed=true — Borrar completadas

# 🧱 Estructura del proyecto

gestor-tareas/
├── backend/
│   ├── db.js
│   ├── initDB.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── boardRoutes.js
│   │   └── taskRoutes.js
│   ├── middlewares/
│   │   └── authMiddleware.js
│   └── index.js
├── src/
│   ├── pages/
│   ├── components/
│   ├── services/
│   ├── store/
│   ├── types/
│   └── App.tsx
└── db/
    └── database.sqlite

### Desarrollado por [Benjamin Orellana 36978] — Proyecto para Programación III.