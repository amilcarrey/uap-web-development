# 📝 TaskBoard - Gestor de Tareas con Tableros Compartibles

TaskBoard es una aplicación full-stack para gestionar tareas, organizadas por tableros, con funcionalidades de colaboración entre usuarios.

---

## 🧱 Tecnologías Utilizadas

- **Backend:** Node.js, Express, SQLite3
- **Frontend:** React, TypeScript, TailwindCSS, React Query, React Router
- **Autenticación:** Cookies + JWT
- **Base de Datos:** SQLite con migraciones SQL y claves foráneas

---

## 🔐 Autenticación

Autenticación basada en sesiones con cookies HTTP-only.

### POST `/api/auth/register`

Registra un nuevo usuario.

```json
Request:
{
  "email": "ejemplo@email.com",
  "password": "123456"
}

Response:
201 Created
{
  "message": "Usuario registrado"
}
```

> 🔄 Al registrarse, se crea automáticamente un tablero personal asociado al usuario.

---

### POST `/api/auth/login`

Inicia sesión con un email y contraseña.

```json
Request:
{
  "email": "ejemplo@email.com",
  "password": "123456"
}

Response:
200 OK
{
  "id": "uuid-del-usuario",
  "email": "ejemplo@email.com"
}
```

---

### POST `/api/auth/logout`

Cierra sesión eliminando la cookie.

---

### GET `/api/auth/me`

Verifica si hay una sesión activa.

---

## 📋 Endpoints de Tareas

### GET `/api/tasks`

Obtiene tareas filtradas, paginadas y buscadas.

**Query Params:**

- `filter`: `"all" | "done" | "undone"`
- `page`: número (default 1)
- `limit`: número (default 5)
- `boardId`: ID del tablero
- `search`: texto a buscar

```http
GET /api/tasks?filter=all&page=1&limit=5&boardId=abc123&search=leer
```

---

### POST `/api/tasks`

Crea una nueva tarea.

```json
Request:
{
  "text": "Leer documentación",
  "boardId": "uuid-del-tablero"
}
```

---

### POST `/api/tasks/:id`

Actualiza una tarea (completar o editar).

```json
// Marcar como completada
{
  "action": "complete",
  "completed": true
}

// Editar texto
{
  "action": "edit",
  "text": "Nuevo texto"
}
```

---

### DELETE `/api/tasks/:id`

Elimina una tarea por ID.

---

### POST `/api/tasks/clear-completed`

Elimina todas las tareas completadas del tablero actual.

```json
Request:
{
  "boardId": "uuid-del-tablero"
}
```

---

## 🗂️ Endpoints de Tableros

### GET `/api/boards`

Obtiene todos los tableros a los que el usuario tiene acceso.

---

### GET `/api/boards/:id`

Devuelve un tablero por ID.

---

### POST `/api/boards`

Crea un nuevo tablero.

```json
Request:
{
  "name": "Trabajo",
  "description": "Tablero para tareas laborales",
  "owner_id": "uuid-del-usuario"
}
```

---

### DELETE `/api/boards/:id`

Elimina un tablero y sus tareas asociadas.

---

### POST `/api/boards/:id/share`

Agrega permisos a otro usuario.

```json
Request:
{
  "userId": "uuid-de-otro-usuario",
  "role": "editor"
}
```

---

### GET `/api/boards/:id/users`

Obtiene usuarios con acceso a un tablero.

---

## 💻 Frontend

### Rutas Principales

- `/login`: Iniciar sesión
- `/register`: Registrar usuario
- `/`: Panel de tareas (requiere login)

---

### Funcionalidades del Frontend

- Cambiar entre tableros (navbar)
- Crear y eliminar tableros
- Compartir tableros con otros usuarios
- CRUD de tareas con paginación, filtrado, búsqueda y limpieza de tareas completadas
- Modal de compartir tablero con roles (`owner`, `editor`, `viewer`)
- Configuración visual (descripciones en mayúscula, auto-refresh)
- Responsive y accesible

---

### Integración con Backend

- `useAuth`: maneja login, logout, registro y sesión persistente
- `useTaskActions`: encapsula mutaciones de tareas (add, edit, delete, complete)
- `useTasks`: obtiene tareas con React Query y polling opcional
- `useBoards`: obtiene y modifica tableros

---

## 🛠️ Consideraciones Técnicas

- Seguridad:
  - Cookies `HttpOnly` para sesiones
  - Control de acceso a tableros por usuario con `board_permissions`
- SQL:
  - Relaciones con claves foráneas y `ON DELETE CASCADE`
- Escalabilidad:
  - Separación clara entre controladores, repositorios y hooks
  - Tableros compartidos soportan múltiples roles

---

## 🧪 Scripts Útiles

```bash
npm install        # Instala dependencias
npm run dev        # Ejecuta frontend y backend
npm run migrate    # Ejecuta migraciones SQLite (si lo tienes configurado)
```

---

## 📌 Ejemplo de flujo

1. Un usuario se registra.
2. Se crea un tablero personal automáticamente.
3. Inicia sesión y visualiza solo sus tableros.
4. Crea tareas, invita a otros usuarios.
5. Los colaboradores pueden ver/editar según el rol otorgado.

---

## 📬 Contacto

En cualquier situacion de error de codigo o en alguna funcionalidad, estoy a disposicion de todo.

---