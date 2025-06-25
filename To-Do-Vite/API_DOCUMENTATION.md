# Documentación de la API - To-Do App

## Información General

- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`
- **Autenticación**: JWT Token (cookie HTTP-only)
- **CORS**: Habilitado para `http://localhost:5173`

## Autenticación

### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "username": "nuevo_usuario",
  "password": "mi_contraseña_segura"
}
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Usuario registrado correctamente"
}
```

**Respuesta de Error (409):**
```json
{
  "error": "El usuario ya existe"
}
```

### Inicio de Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "username": "luca",
  "password": "admin123"
}
```

**Respuesta Exitosa (200):**
```json
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "username": "luca"
  }
}
```

**Headers de Respuesta:**
```
Set-Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Max-Age=86400
```

### Cerrar Sesión
```http
POST /auth/logout
```

**Respuesta (200):**
```json
{
  "message": "Logout exitoso"
}
```

## Gestión de Tableros

### Obtener Tableros del Usuario
```http
GET /boards
```

**Respuesta Exitosa (200):**
```json
[
  {
    "id": 1,
    "name": "Tareas Personales",
    "category": "Personal",
    "created_at": "2024-01-15T10:30:00.000Z",
    "user_id": 1
  },
  {
    "id": 2,
    "name": "Proyectos Universidad",
    "category": "Universidad",
    "created_at": "2024-01-16T14:20:00.000Z",
    "user_id": 1
  }
]
```

### Crear Tablero
```http
POST /boards
Content-Type: application/json

{
  "name": "Mi Nuevo Proyecto",
  "category": "Personal"
}
```

**Respuesta Exitosa (201):**
```json
{
  "id": 3,
  "name": "Mi Nuevo Proyecto",
  "category": "Personal",
  "created_at": "2024-01-17T09:15:00.000Z",
  "user_id": 1
}
```

### Eliminar Tablero
```http
DELETE /boards/Mi%20Nuevo%20Proyecto
```

**Respuesta (200):**
```json
{
  "message": "Tablero eliminado correctamente"
}
```

## Compartir Tableros

### Compartir Tablero con Usuario
```http
POST /boards/Tareas%20Personales/share
Content-Type: application/json

{
  "username": "maria",
  "role": "editor"
}
```

**Respuesta (200):**
```json
{
  "message": "Tablero compartido exitosamente"
}
```

**Roles Disponibles:**
- `owner`: Control total
- `editor`: Puede gestionar tareas
- `viewer`: Solo puede ver

### Obtener Usuarios del Tablero
```http
GET /boards/Tareas%20Personales/users
```

**Respuesta (200):**
```json
[
  {
    "username": "luca",
    "role": "owner"
  },
  {
    "username": "maria",
    "role": "editor"
  }
]
```

### Remover Usuario del Tablero
```http
DELETE /boards/Tareas%20Personales/users/maria
```

**Respuesta (200):**
```json
{
  "message": "Usuario removido exitosamente"
}
```

## Gestión de Tareas

### Obtener Tareas con Filtros
```http
GET /boards/Tareas%20Personales/tasks?page=1&limit=10&search=importante&filter=active
```

**Parámetros de Query:**
- `page`: Número de página (default: 1)
- `limit`: Tareas por página (default: 10)
- `search`: Búsqueda por texto
- `filter`: `all`, `active`, `completed`

**Respuesta (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "text": "Tarea importante pendiente",
      "completed": false,
      "created_at": "2024-01-15T10:30:00.000Z",
      "board_id": 1
    }
  ],
  "pagination": {
    "totalTasks": 1,
    "totalPages": 1,
    "page": 1,
    "limit": 10
  }
}
```

### Crear Tarea
```http
POST /boards/Tareas%20Personales/tasks
Content-Type: application/json

{
  "text": "Nueva tarea importante"
}
```

**Respuesta (201):**
```json
{
  "id": 2,
  "text": "Nueva tarea importante",
  "completed": false,
  "created_at": "2024-01-17T10:30:00.000Z",
  "board_id": 1
}
```

### Actualizar Tarea
```http
PATCH /boards/Tareas%20Personales/tasks/2
Content-Type: application/json

{
  "text": "Tarea actualizada",
  "completed": true
}
```

**Respuesta (200):**
```json
{
  "id": 2,
  "text": "Tarea actualizada",
  "completed": true,
  "created_at": "2024-01-17T10:30:00.000Z",
  "board_id": 1
}
```

### Eliminar Tarea
```http
DELETE /boards/Tareas%20Personales/tasks/2
```

**Respuesta (200):**
```json
{
  "message": "Tarea eliminada correctamente"
}
```

### Eliminar Tareas Completadas
```http
DELETE /boards/Tareas%20Personales/tasks/completed
```

**Respuesta (200):**
```json
{
  "message": "Tareas completadas eliminadas correctamente"
}
```

## Enlaces Compartidos

### Crear Enlace Compartido
```http
POST /boards/Tareas%20Personales/share-link
Content-Type: application/json

{
  "expiresInDays": 30
}
```

**Respuesta (200):**
```json
{
  "token": "abc123def456ghi789",
  "expiresAt": "2024-02-16T10:30:00.000Z"
}
```

### Obtener Tablero Compartido
```http
GET /shared/abc123def456ghi789
```

**Respuesta (200):**
```json
{
  "id": 1,
  "name": "Tareas Personales",
  "category": "Personal",
  "created_at": "2024-01-15T10:30:00.000Z"
}
```

### Obtener Tareas del Tablero Compartido
```http
GET /shared/abc123def456ghi789/tasks
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "text": "Tarea importante",
    "completed": false,
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

## Panel de Administración

### Obtener Estadísticas del Sistema
```http
GET /admin/stats
```

**Respuesta (200):**
```json
{
  "users": 4,
  "boards": 6,
  "tasks": 18
}
```

### Obtener Lista de Usuarios
```http
GET /admin/users
```

**Respuesta (200):**
```json
[
  {
    "id": 1,
    "username": "luca",
    "created_at": "2024-01-01T00:00:00.000Z",
    "boards_count": 3,
    "tasks_count": 12
  },
  {
    "id": 2,
    "username": "maria",
    "created_at": "2024-01-02T00:00:00.000Z",
    "boards_count": 2,
    "tasks_count": 6
  }
]
```

### Eliminar Usuario
```http
DELETE /admin/users/2
```

**Respuesta (200):**
```json
{
  "message": "Usuario eliminado correctamente"
}
```

## Códigos de Error

### Errores de Autenticación
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Sin permisos para acceder al recurso

### Errores de Validación
- `400 Bad Request`: Datos de entrada inválidos
- `409 Conflict`: Recurso ya existe (usuario duplicado)

### Errores del Servidor
- `500 Internal Server Error`: Error interno del servidor

### Ejemplos de Respuestas de Error
```json
{
  "error": "Usuario o contraseña incorrectos"
}
```

```json
{
  "error": "No tienes permisos para acceder a este tablero"
}
```

```json
{
  "error": "El usuario ya existe"
}
```

## Ejemplos de Uso con cURL

### Flujo Completo de Autenticación
```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test_user", "password": "test123"}'

# 2. Iniciar sesión y guardar cookies
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test_user", "password": "test123"}' \
  -c cookies.txt

# 3. Crear tablero usando cookies
curl -X POST http://localhost:3000/boards \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"name": "Mi Tablero", "category": "Personal"}'

# 4. Crear tarea
curl -X POST http://localhost:3000/boards/Mi%20Tablero/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"text": "Mi primera tarea"}'

# 5. Obtener tareas
curl -X GET "http://localhost:3000/boards/Mi%20Tablero/tasks" \
  -b cookies.txt
```

### Ejemplos con JavaScript/Fetch
```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ username: 'luca', password: 'admin123' })
});

// Crear tablero
const boardResponse = await fetch('http://localhost:3000/boards', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ name: 'Nuevo Tablero', category: 'Personal' })
});

// Obtener tareas
const tasksResponse = await fetch('http://localhost:3000/boards/Nuevo%20Tablero/tasks', {
  credentials: 'include'
});
```

## Consideraciones de Seguridad

1. **Tokens JWT**: Se almacenan como cookies HTTP-only
2. **Validación**: Todos los inputs se validan en frontend y backend
3. **Autorización**: Verificación de permisos por tablero
4. **CORS**: Configurado para permitir solo el origen del frontend
5. **Hashing**: Contraseñas hasheadas con bcrypt

---

**Esta documentación cubre todos los endpoints disponibles en la API. Para más información, consulta el código fuente del backend.** 