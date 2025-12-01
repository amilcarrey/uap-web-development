# Tarea 8: Backend Avanzado con Autenticación y Autorización

## 🚀 Inicio Rápido

**¿Primera vez ejecutando el proyecto?** 
👉 [**Guía de Instalación Completa**](./SETUP_GUIDE.md)

**¿Necesitas consultar la API?** 
👉 [**Documentación de la API**](./API_DOCUMENTATION.md)

---

En este ejercicio desarrollaremos un backend robusto y completo usando **Express.js** que soporte todas las funcionalidades implementadas hasta el momento, agregando autenticación de usuarios, autorización basada en permisos y persistencia en **base de datos relacional**.

## Objetivos Principales

1. **Arquitectura Backend Escalable:** Implementar una API REST bien estructurada y mantenible usando **Express.js**
2. **Base de Datos Relacional:** Utilizar una base de datos relacional para el almacenamiento persistente
3. **Autenticación Segura:** Implementar sistema de registro e inicio de sesión con almacenamiento seguro de credenciales
4. **Autorización Granular:** Sistema de permisos que permita control de acceso a tableros y tareas
5. **Integración Frontend:** Conectar la aplicación React existente con el nuevo backend

## Funcionalidades Requeridas

### 1. Sistema de Tableros

- Los usuarios autenticados pueden crear tableros de tareas
- Cada tablero debe tener un propietario que puede controlarlo completamente
- Los propietarios pueden compartir acceso a sus tableros con otros usuarios
- Implementar diferentes niveles de acceso (propietario, editor, solo lectura)
- Los usuarios solo pueden ver y acceder a tableros donde tienen permisos

### 2. Gestión Avanzada de Tareas

- Mantener todas las funcionalidades existentes: crear, editar, eliminar, completar tareas
- Las tareas pertenecen a tableros específicos
- Solo usuarios con permisos apropiados pueden modificar tareas
- Implementar paginación para manejar grandes cantidades de tareas
- Agregar capacidades de filtrado y búsqueda
- Eliminar tareas completadas en lote
- Filtrar tareas por diferentes criterios
- Búsqueda de tareas por contenido

### 3. Configuraciones Personalizadas

Los usuarios deben poder personalizar aspectos de la aplicación:

- Configurar intervalos de actualización automática
- Personalizar la visualización de las tareas
- Guardar preferencias que persistan entre sesiones
- Las configuraciones deben aplicarse automáticamente en la interfaz

### 4. Sistema de Usuarios

- Los usuarios deben poder registrarse en el sistema proporcionando la información necesaria
- Los usuarios deben poder iniciar sesión usando sus credenciales
- Implementar un sistema seguro de manejo de sesiones usando **JWT en HTTP-only cookies**
- Los usuarios deben poder cerrar sesión de manera segura
- Proteger las rutas que requieren autenticación

### 5. Sistema de Permisos

- Solo los propietarios pueden eliminar tableros o cambiar permisos
- Los usuarios con permisos de edición pueden gestionar tareas
- Los usuarios con permisos de solo lectura pueden ver pero no modificar

## Integración Frontend

**Modificaciones en React:**

- Actualizar la aplicación React existente para trabajar con el nuevo sistema de autenticación
- Implementar formularios de registro e inicio de sesión
- Manejar el estado de autenticación globalmente
- Adaptar la gestión de estado para trabajar con múltiples tableros
- Implementar interfaz para compartir tableros y gestionar permisos
- Crear página de configuraciones de usuario
- Manejar adecuadamente errores de autenticación y autorización

**Consideraciones de Seguridad:**

- Manejar tokens de autenticación de manera segura
- Implementar redirecciones automáticas según el estado de autenticación
- Manejar expiración de sesiones adecuadamente

## Requisitos Técnicos

### Backend

- Usar **Express.js** como framework principal
- Implementar una **base de datos relacional** (elige la que prefieras)
- Crear una API REST bien estructurada y documentada
- Implementar middlewares apropiados para autenticación, autorización y validación
- Manejar errores de manera consistente
- Organizar el código de manera mantenible y escalable

### Seguridad

- Almacenar contraseñas de manera segura
- Implementar autenticación basada en JWT
- Usar HTTP-only cookies para almacenar tokens
- Validar y sanitizar todas las entradas
- Implementar protecciones contra ataques comunes
- Configurar CORS apropiadamente

### Base de Datos

- Diseñar un esquema relacional apropiado
- Implementar relaciones entre entidades (usuarios, tableros, tareas, permisos)
- Crear índices para optimizar consultas frecuentes
- Implementar migraciones para cambios de esquema

## Criterios de Evaluación

1. **Arquitectura y Organización:** Código bien estructurado, mantenible y siguiendo mejores prácticas
2. **Seguridad:** Implementación robusta de autenticación y autorización
3. **Funcionalidad:** Todas las características funcionan correctamente
4. **Integración:** La aplicación React se conecta seamlessly con el backend
5. **Calidad del Código:** Código limpio, bien documentado y testeable
6. **Manejo de Errores:** Respuestas de error apropiadas y consistentes
7. **Performance:** Queries optimizadas y uso eficiente de recursos

## Entregables

1. **Código Backend completo** con todas las funcionalidades implementadas ✅
2. **Base de datos configurada** con esquema apropiado y datos de prueba ✅
3. **Aplicación React actualizada** e integrada con el nuevo backend ✅
4. **Documentación de la API** con descripción de endpoints y ejemplos ✅ → [Ver API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
5. **Instrucciones de configuración** para ejecutar el proyecto localmente ✅ → [Ver SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 📚 Documentación de la API

### Base URL
```
http://localhost:3001/api
```

### Autenticación
La API utiliza **JWT tokens en HTTP-only cookies** para la autenticación. Todas las rutas protegidas requieren que el usuario esté autenticado.

### Endpoints de Autenticación (`/api/auth`)

#### `POST /auth/register`
Registra un nuevo usuario en el sistema.

**Request Body:**
```json
{
    "username": "string (3-20 chars, alphanumeric + _)",
    "email": "string (valid email)",
    "password": "string (min 6 chars, uppercase + lowercase + numbers)"
}
```

**Response (201):**
```json
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com",
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

#### `POST /auth/login`
Autentica un usuario y establece la cookie de sesión.

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "password123"
}
```

**Response (200):**
```json
{
    "message": "Login successful",
    "user": {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com"
    }
}
```

#### `POST /auth/logout`
Cierra la sesión del usuario y limpia las cookies.

**Response (200):**
```json
{
    "message": "Logout successful"
}
```

#### `GET /auth/me` 🔒
Obtiene la información del usuario autenticado.

**Response (200):**
```json
{
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /auth/users` 🔒
Obtiene la lista de todos los usuarios registrados.

**Response (200):**
```json
[
    {
        "id": 1,
        "username": "johndoe",
        "email": "john@example.com"
    },
    {
        "id": 2,
        "username": "janedoe",
        "email": "jane@example.com"
    }
]
```

#### `GET /auth/settings` 🔒
Obtiene las configuraciones del usuario autenticado.

**Response (200):**
```json
{
    "refresh_interval": 5000,
    "uppercase_descriptions": false,
    "todos_per_page": 10
}
```

#### `PUT /auth/settings` 🔒
Actualiza las configuraciones del usuario.

**Request Body:**
```json
{
    "refresh_interval": 3000,
    "uppercase_descriptions": true,
    "todos_per_page": 15
}
```

**Response (200):**
```json
{
    "message": "Settings updated successfully",
    "settings": {
        "refresh_interval": 3000,
        "uppercase_descriptions": true,
        "todos_per_page": 15
    }
}
```

#### `GET /auth/boards` 🔒
Obtiene todos los tableros accesibles para el usuario (propios y compartidos).

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "My Personal Board",
        "created_at": "2024-01-01T00:00:00.000Z",
        "user_permission": "owner",
        "owner": {
            "id": 1,
            "username": "johndoe",
            "email": "john@example.com"
        }
    },
    {
        "id": 2,
        "name": "Shared Project",
        "created_at": "2024-01-02T00:00:00.000Z",
        "user_permission": "editor",
        "owner": {
            "id": 2,
            "username": "janedoe",
            "email": "jane@example.com"
        }
    }
]
```

### Endpoints de Tableros (`/api/boards`) 🔒

*Todas las rutas de tableros requieren autenticación.*

#### `GET /boards`
Obtiene los tableros creados por el usuario autenticado.

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "My Board",
        "owner_id": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
    }
]
```

#### `GET /boards/accessible`
Obtiene todos los tableros accesibles (propios y compartidos) con información de permisos.

**Response (200):**
```json
[
    {
        "id": 1,
        "name": "My Board",
        "created_at": "2024-01-01T00:00:00.000Z",
        "user_permission": "owner",
        "owner": {
            "id": 1,
            "username": "johndoe",
            "email": "john@example.com"
        }
    }
]
```

#### `POST /boards`
Crea un nuevo tablero.

**Request Body:**
```json
{
    "name": "New Project Board"
}
```

**Response (201):**
```json
{
    "id": 3,
    "name": "New Project Board",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /boards/:boardId` 👁️
Obtiene un tablero específico (requiere permisos de view).

**Response (200):**
```json
{
    "id": 1,
    "name": "My Board",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### `PUT /boards/:boardId` ✏️
Actualiza un tablero (requiere permisos de edit).

**Request Body:**
```json
{
    "name": "Updated Board Name"
}
```

**Response (200):**
```json
{
    "id": 1,
    "name": "Updated Board Name",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### `DELETE /boards/:boardId` 👑
Elimina un tablero (requiere ownership).

**Response (200):**
```json
{
    "message": "Board deleted successfully"
}
```

### Endpoints de Permisos

#### `POST /boards/:boardId/share` 👑
Comparte un tablero con otro usuario (requiere ownership).

**Request Body:**
```json
{
    "email": "user@example.com",
    "permission_level": "editor"
}
```

**Response (201):**
```json
{
    "message": "Board shared successfully",
    "permission": {
        "id": 1,
        "board_id": 1,
        "user_id": 2,
        "permission_level": "editor",
        "granted_by": 1,
        "created_at": "2024-01-01T00:00:00.000Z"
    }
}
```

#### `GET /boards/:boardId/permissions` 👁️
Obtiene la lista de permisos de un tablero.

**Response (200):**
```json
[
    {
        "id": 1,
        "user_id": 2,
        "username": "janedoe",
        "email": "jane@example.com",
        "permission_level": "editor",
        "granted_at": "2024-01-01T00:00:00.000Z"
    }
]
```

#### `PUT /boards/:boardId/permissions/:userId` 👑
Actualiza los permisos de un usuario en un tablero.

**Request Body:**
```json
{
    "permission_level": "viewer"
}
```

#### `DELETE /boards/:boardId/permissions/:userId` 👑
Elimina los permisos de un usuario en un tablero.

### Endpoints de Tareas (`/api/boards/:boardId/todos`)

#### `GET /boards/:boardId/todos` 👁️
Obtiene las tareas de un tablero con filtros y paginación.

**Query Parameters:**
- `filter`: `all`, `completed`, `uncompleted` (opcional)
- `page`: número de página (opcional, default: 1)
- `limit`: tareas por página (opcional, default: 10, max: 100)
- `search`: término de búsqueda (opcional, max: 100 chars)

**Response (200):**
```json
{
    "todos": [
        {
            "id": 1,
            "text": "Complete project documentation",
            "completed": false,
            "board_id": 1,
            "created_at": "2024-01-01T00:00:00.000Z"
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "totalItems": 25,
        "totalPages": 3,
        "hasNext": true,
        "hasPrev": false
    }
}
```

#### `POST /boards/:boardId/todos` ✏️
Crea una nueva tarea (requiere permisos de edit).

**Request Body:**
```json
{
    "text": "New task description"
}
```

**Response (201):**
```json
{
    "id": 2,
    "text": "New task description",
    "completed": false,
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /boards/:boardId/todos/:id` 👁️
Obtiene una tarea específica.

#### `PUT /boards/:boardId/todos/:id` ✏️
Actualiza una tarea.

**Request Body:**
```json
{
    "text": "Updated task description"
}
```

#### `PATCH /boards/:boardId/todos/:id/toggle` ✏️
Cambia el estado de completado de una tarea.

**Response (200):**
```json
{
    "id": 1,
    "text": "Complete project documentation",
    "completed": true,
    "board_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
}
```

#### `DELETE /boards/:boardId/todos/:id` ✏️
Elimina una tarea específica.

#### `DELETE /boards/:boardId/todos/clear-completed` ✏️
Elimina todas las tareas completadas del tablero.

**Response (200):**
```json
{
    "message": "Completed todos cleared",
    "deletedCount": 5
}
```

### Códigos de Estado de Error

- **400 Bad Request**: Datos inválidos o faltantes
- **401 Unauthorized**: No autenticado
- **403 Forbidden**: Sin permisos para la acción
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email ya registrado)
- **422 Unprocessable Entity**: Errores de validación
- **500 Internal Server Error**: Error del servidor

### Leyenda de Permisos

- 🔒 **Autenticación requerida**
- 👁️ **View permission**: Puede ver el tablero
- ✏️ **Edit permission**: Puede editar tareas
- 👑 **Owner permission**: Control total del tablero

---

## ⚙️ Instrucciones de Configuración

### Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Git**

### 1. Clonar y Configurar el Proyecto

```bash
# Clonar el repositorio
git clone <repository-url>
cd uap-web-development/exercises/8-Advanced-Backend

# O navegar al directorio si ya tienes el proyecto
cd exercises/8-Advanced-Backend
```

### 2. Configuración del Backend

```bash
# Navegar al directorio del backend
cd express-api

# Instalar dependencias
npm install

# Crear archivo de configuración
cp .env.example .env
# O crear manualmente el archivo .env con el siguiente contenido:
```

**Archivo `.env` (express-api/.env):**
```env
# Configuración de la base de datos
DATABASE_URL=./database.sqlite

# Configuración JWT
JWT_SECRET=tu_clave_secreta_super_segura_para_jwt_tokens_2024

# Configuración del servidor
PORT=3001
NODE_ENV=development

# Configuración de CORS
CORS_ORIGIN=http://localhost:5173
```

```bash
# Inicializar la base de datos
npm run init-db

# Ejecutar migraciones (si es necesario)
npm run migrate:todos-per-page

# Compilar TypeScript
npm run build

# Iniciar el servidor en modo desarrollo
npm run dev
```

El backend estará disponible en: `http://localhost:3001`

### 3. Configuración del Frontend

```bash
# En una nueva terminal, navegar al directorio del frontend
cd react

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:5173` o `http://localhost:5174`

### 4. Verificación de la Instalación

#### Backend Health Check:
```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Frontend:
Abrir `http://localhost:5173` en el navegador y verificar que carga la aplicación.

### 5. Scripts Disponibles

#### Backend (express-api/):
```bash
npm run dev          # Desarrollo con auto-reload
npm run build        # Compilar TypeScript
npm start           # Ejecutar versión compilada
npm run init-db     # Inicializar base de datos
npm test            # Ejecutar tests
```

#### Frontend (react/):
```bash
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run preview     # Preview del build
npm run lint        # Verificar código
```

### 6. Estructura de Directorios

```
8-Advanced-Backend/
├── express-api/              # Backend API
│   ├── src/
│   │   ├── modules/          # Módulos de negocio
│   │   ├── routes/           # Definición de rutas
│   │   ├── middleware/       # Middlewares personalizados
│   │   ├── db/              # Configuración de BD
│   │   ├── scripts/         # Scripts de utilidad
│   │   └── index.ts         # Punto de entrada
│   ├── dist/                # Código compilado
│   ├── database.sqlite      # Base de datos SQLite
│   ├── .env                 # Variables de entorno
│   └── package.json
├── react/                   # Frontend React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Estado Redux
│   │   ├── services/       # Servicios API
│   │   ├── context/        # Contextos React
│   │   └── types/          # Definiciones TypeScript
│   ├── public/             # Archivos estáticos
│   └── package.json
└── README.md               # Este archivo
```

### 7. Datos de Prueba

Al ejecutar `npm run init-db`, se crean usuarios y tableros de ejemplo:

**Usuarios de prueba:**
- **Email**: `admin@example.com` | **Password**: `Admin123!`
- **Email**: `user@example.com` | **Password**: `User123!`
- **Email**: `editor@example.com` | **Password**: `Editor123!`

### 8. Troubleshooting

#### Error: Puerto en uso
```bash
# Verificar qué proceso usa el puerto
lsof -i :3001  # Backend
lsof -i :5173  # Frontend

# Terminar proceso si es necesario
kill -9 <PID>
```

#### Error: Base de datos no encontrada
```bash
cd express-api
npm run init-db
```

#### Error: CORS
Verificar que `CORS_ORIGIN` en `.env` coincida con la URL del frontend.

#### Error: JWT Secret
Asegurarse de que `JWT_SECRET` en `.env` sea una cadena segura y no esté vacía.

### 9. Desarrollo

#### Agregar nuevas funcionalidades:
1. **Backend**: Crear módulos en `src/modules/`
2. **Frontend**: Crear componentes en `src/components/`
3. **API**: Definir rutas en `src/routes/`
4. **Estado**: Gestionar en `src/store/` (Redux) o `src/context/`

#### Testing:
```bash
# Backend
cd express-api && npm test

# Frontend  
cd react && npm run lint
```

### 10. Producción

#### Build del proyecto:
```bash
# Backend
cd express-api && npm run build && npm start

# Frontend
cd react && npm run build && npm run preview
```

#### Variables de entorno para producción:
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host:port/db  # Para PostgreSQL
JWT_SECRET=<clave-muy-segura-para-produccion>
CORS_ORIGIN=https://tu-dominio.com
```

## Consideraciones Adicionales

- Piensa cuidadosamente en el diseño de la base de datos antes de implementar
- Considera la experiencia del usuario al diseñar los flujos de autenticación
- Implementa validaciones robustas tanto en el frontend como en el backend
- Maneja casos edge apropiadamente (usuarios sin tableros, tableros sin tareas, etc.)
- Considera la escalabilidad en tus decisiones de diseño

¡Éxito en la implementación!
