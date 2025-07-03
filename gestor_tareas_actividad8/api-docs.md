# Documentación de la API

Esta documentación describe los endpoints disponibles en el backend del gestor de tareas.

---

## Autenticación

### POST /auth/register
Crea un nuevo usuario.

**Body JSON:**
```
{
  "email": "usuario@ejemplo.com",
  "password": "segura123"
}
```

**Respuestas:**
- 201 Created: Usuario registrado exitosamente.
- 400 Bad Request: Datos inválidos.

---

### POST /auth/login
Inicia sesión y devuelve un token JWT.

**Body JSON:**
```
{
  "email": "usuario@ejemplo.com",
  "password": "segura123"
}
```

**Respuestas:**
- 200 OK: Login exitoso y devuelve el token.
- 401 Unauthorized: Credenciales inválidas.

---

## Tableros

### POST /boards
Crea un nuevo tablero. Solo usuarios autenticados.

**Body JSON:**
```
{
  "name": "Mi Tablero"
}
```

**Respuestas:**
- 201 Created
- 401 Unauthorized

---

## Tareas

### GET /boards/:boardId/tasks
Lista tareas de un tablero. Soporta paginación y búsqueda.

**Query params:**
- `page` (opcional, por defecto 1)
- `search` (opcional)

**Respuestas:**
- 200 OK: Devuelve `{ tasks: Task[], total: number }`

---

### POST /boards/:boardId/tasks
Crea una tarea.

**Body JSON:**
```
{
  "text": "Comprar pan"
}
```

**Respuestas:**
- 201 Created
- 400 Bad Request (validación)

---

### PATCH /tasks/:taskId
Edita una tarea.

**Body JSON (al menos un campo):**
```
{
  "text": "Nuevo texto",
  "completed": true
}
```

---

### PATCH /tasks/:taskId/toggle
Alterna el estado `completed` de la tarea.

---

### DELETE /tasks/:taskId
Elimina una tarea.

---

### DELETE /boards/:boardId/tasks/completed
Elimina todas las tareas completadas del tablero.
