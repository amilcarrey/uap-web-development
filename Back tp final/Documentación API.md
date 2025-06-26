# 📘 Documentación de la API

---

## Información General

**Base URL (local):** `http://localhost:3000/api`

* Backend: Express.js
* Base de datos: SQL Server
* Autenticación: JWT en cookies HTTP-only
* Autorización: basada en niveles de acceso (owner, full_access, viewer)

---

## Endpoints de la API (REST)

### Autenticación (`/auth`)

#### `POST /auth`

Registrar un nuevo usuario.

```json
{
  "username": "User",
  "password": "123456"
}
```

#### `POST /auth/login`

Iniciar sesión (almacena JWT en cookie segura).

```json
{
  "username": "User",
  "password": "123456"
}
```

#### `POST /auth/logout`

Cerrar sesión (elimina cookie).

#### `GET /auth`

Obtener todos los usuarios (requiere sesión iniciada).

---

###  Tableros (`/board`)

#### `GET /board/user`

Obtener todos los tableros donde el usuario tiene permisos.

#### `GET /board/:id`

Obtener un tablero específico.

#### `POST /board`

Crear un nuevo tablero.

```json
{
  "name": "Tablero 1"
}
```

#### `DELETE /board/:id`

Eliminar un tablero (solo el owner).

#### `POST /board/:id/invite`

Invitar usuario a un tablero (solo el owner).

```json
{
  "user_id": "u2",
  "access_level": "viewer" // o "full_access"
}
```

---

###  Permisos (`/permission`)

#### `GET /permission/user/:user_id`

Listar permisos de un usuario.

#### `GET /permission/:id`

Obtener detalles de un permiso.

#### `POST /permission`

Crear un permiso (solo owner).

```json
{
  "user_id": "u2",
  "board_id": "b1",
  "access_level": "viewer"
}
```

#### `PUT /permission/:id`

Modificar nivel de acceso (solo owner).

#### `DELETE /permission/:id`

Eliminar un permiso (solo owner).

---

### Recordatorios (`/reminder`)

#### `GET /reminder/:board_id`

Obtener recordatorios de un tablero (requiere permiso mínimo: viewer).

#### `GET /reminder/single/:id`

Obtener detalles de un recordatorio.

#### `POST /reminder`

Crear recordatorio (permiso: full\_access).

```json
{
  "board_id": "b1",
  "name": "Recordatorio 1"
}
```

#### `PUT /reminder/:id`

Editar recordatorio.

```json
{
  "name": "Nuevo nombre"
}
```

#### `PATCH /reminder/:id/toggle`

Alternar completado.

#### `DELETE /reminder/:id`

Eliminar recordatorio.

#### `DELETE /reminder/completed/:board_id`

Eliminar todos los completados de un tablero.

---

###  Configuración de Usuario (`/user-settings`)

#### `GET /user-settings`

Obtener configuración actual.

#### `POST /user-settings`

Crear configuración (si no existe).

#### `PUT /user-settings`

Actualizar configuración.

```json
{
  "refetch_interval": 10000,
  "uppercase_descriptions": false,
  "task_page_size": 10
}
```

---

## Instrucciones para Ejecutar el Proyecto

### 1. Requisitos Previos

* Node.js (v18+)
* SQL Server
* npm o yarn

### 2. Configuración del Backend

#### a. Variables de Entorno (`.env`)

```env
PORT=3000
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=tu_contraseña
DB_NAME=tpFinalProgra2
JWT_SECRET=una_clave_segura
```

#### b. Instalación de dependencias

```bash
cd backend
npm install
```

#### c. Ejecución del servidor

```bash
npm run dev
```

### 3. Configuración del Frontend

#### a. Variables de Entorno (`.env`)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

#### b. Instalación

```bash
cd frontend
npm install
```

#### c. Ejecución

```bash
npm run dev
```

---

### 4. Estructura de la Base de Datos

Debes contar con las siguientes tablas creadas:

* `users(id, username, password_hash)`
* `boards(id, name, owner_id)`
* `reminders(id, name, completed, board_id)`
* `permissions(id, user_id, board_id, access_level)`
* `user_settings(id, user_id, task_page_size, refetch_interval, uppercase_descriptions)`

> Las relaciones están resueltas con claves foráneas, y las restricciones de permisos se manejan en el backend con middlewares.

---

### 5. Datos de Prueba (Opcional)

```sql
INSERT INTO users (id, username, password_hash) VALUES ('u1', 'admin', 'hash');
INSERT INTO boards (id, name, owner_id) VALUES ('b1', 'Principal', 'u1');
INSERT INTO permissions (id, user_id, board_id, access_level) VALUES ('p1', 'u1', 'b1', 'owner');
```

---

## Seguridad y Consideraciones

* Las sesiones se mantienen mediante cookies HTTP-only (JWT).
* La autenticación se maneja con middleware `authWithCookiesMiddleware`.
* La autorización se controla con `requirePermission(level)`.
* El frontend valida estado de sesión automáticamente y redirige según permisos.
* Todas las rutas sensibles requieren autenticación.


