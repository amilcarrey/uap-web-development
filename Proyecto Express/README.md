

---

## 1) Documentación de la API

````markdown
# Documentación de la API

Esta API corresponde a una aplicación de gestión de tableros y tareas con usuarios, roles y configuración.

---

## Endpoints

### Autenticación

#### POST /api/auth/register

- Registra un nuevo usuario.

**Request Body:**

```json
{
  "email": "usuario@example.com",
  "password": "tu_contraseña"
}
````

**Response:**

```json
{
  "user": {
    "id": "user-uuid",
    "email": "usuario@example.com"
  },
  "token": "jwt_token"
}
```

---

#### POST /api/auth/login

* Inicia sesión con usuario y contraseña.

**Request Body:**

```json
{
  "email": "usuario@example.com",
  "password": "tu_contraseña"
}
```

**Response:**

```json
{
  "user": {
    "id": "user-uuid",
    "email": "usuario@example.com"
  },
  "token": "jwt_token"
}
```

---

### Tableros (Boards)

#### GET /api/boards

* Obtiene todos los tableros accesibles por el usuario autenticado.

**Response:**

```json
[
  {
    "id": "board-uuid",
    "name": "General",
    "created_at": "2024-06-26T12:34:56Z"
  },
  ...
]
```

---

#### POST /api/boards

* Crea un nuevo tablero.

**Request Body:**

```json
{
  "name": "Nombre del tablero"
}
```

**Response:**

```json
{
  "id": "board-uuid",
  "name": "Nombre del tablero",
  "created_at": "2024-06-26T12:34:56Z"
}
```

---

### Tareas (Tasks)

#### GET /api/tasks

* Obtiene tareas filtradas por tablero, estado, etc.

**Query Parameters:**

* `activeBoardId` (opcional) - filtra por tablero.

**Response:**

```json
[
  {
    "id": "task-uuid",
    "text": "Comprar leche",
    "done": false,
    "activeBoardId": "board-uuid",
    "created_at": "2024-06-26T12:45:00Z"
  },
  ...
]
```

---

#### POST /api/tasks

* Crea una tarea nueva.

**Request Body:**

```json
{
  "text": "Comprar leche",
  "activeBoardId": "board-uuid"
}
```

**Response:**

```json
{
  "id": "task-uuid",
  "text": "Comprar leche",
  "done": false,
  "activeBoardId": "board-uuid",
  "created_at": "2024-06-26T12:45:00Z"
}
```

---

#### PATCH /api/tasks/\:id

* Actualiza el texto de una tarea.

**Request Body:**

```json
{
  "text": "Comprar leche y pan"
}
```

**Response:**

```json
{
  "id": "task-uuid",
  "text": "Comprar leche y pan",
  "done": false,
  "activeBoardId": "board-uuid",
  "created_at": "2024-06-26T12:45:00Z"
}
```

---

#### PATCH /api/tasks/\:id/toggle

* Cambia el estado `done` de la tarea (completada / no completada).

**Response:**

```json
{
  "id": "task-uuid",
  "text": "Comprar leche",
  "done": true,
  "activeBoardId": "board-uuid",
  "created_at": "2024-06-26T12:45:00Z"
}
```

---

#### DELETE /api/tasks/\:id

* Elimina una tarea.

**Response:**

* Código HTTP 204 No Content

---

### Configuración (Settings)

#### GET /api/settings

* Obtiene las configuraciones personalizadas del usuario.

**Response:**

```json
{
  "refetchInterval": 10000,
  "uppercaseDescriptions": false
}
```

---

#### POST /api/settings

* Guarda las configuraciones personalizadas del usuario.

**Request Body:**

```json
{
  "refetchInterval": 15000,
  "uppercaseDescriptions": true
}
```

**Response:**

* Código HTTP 200 OK

---

# Autorización

Todos los endpoints (excepto login y registro) requieren que el usuario esté autenticado, mediante JWT enviado en cookies HTTP-only.

---

# Notas

* Las fechas están en formato ISO 8601 UTC.
* Los IDs son UUID strings.
* Se respetan roles y permisos en tableros y tareas (owner, editor, viewer).

---

## 2) Instrucciones para ejecutar el proyecto localmente

```markdown
# Configuración y Ejecución Local

Estas instrucciones te ayudarán a poner en marcha la aplicación en tu máquina local.

---

## Requisitos previos

- Node.js (versión 18 o superior recomendada)  
- npm o yarn  
- SQLite3 (no es necesario instalar aparte, la base de datos es un archivo local)

---

## Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/tu_repositorio.git
cd tu_repositorio
````

---

## Instalación de dependencias

```bash
npm install
# o con yarn
# yarn install
```

---

## Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables (ajusta según sea necesario):

```env
PORT=3000
JWT_SECRET=tu_secreto_para_jwt
FRONTEND_URL=http://localhost:5173
COOKIE_SECRET=un_secreto_para_cookies
```

---

## Ejecutar migraciones y seeders

Las migraciones se ejecutan automáticamente al iniciar el servidor.

Si tenés un script para insertar usuarios o datos iniciales, ejecútalo así:

```bash
npx ts-node src/db/seed.ts
```

(O si el seed está integrado en migraciones, ya estarán insertados)

---

## Ejecutar el servidor

```bash
npm run dev
```

El servidor escuchará por defecto en `http://localhost:3000`.

---

## Ejecutar el frontend

Si usás Vite, React u otro framework:

```bash
npm run dev --workspace frontend
```

Luego acceder a `http://localhost:5173`.

---

## Probar la API

Puedes probar la API con herramientas como Postman o curl.

Por ejemplo, para listar tableros (requiere autenticación):

```bash
curl -i -X GET http://localhost:3000/api/boards --cookie "token=tu_jwt_cookie"
```

---

## Notas adicionales

* El backend usa JWT en cookies HTTP-only para autenticación.
* Las migraciones crean la estructura y los índices necesarios.
* Configuraciones de usuario se guardan y cargan automáticamente.

---
