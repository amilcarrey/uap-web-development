# 📚 Documentación Completa del Proyecto - ChatBot Avanzado

## Índice de Contenidos

1. [Descripción General](#descripción-general)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura de Carpetas](#estructura-de-carpetas)
5. [Componentes Principales](#componentes-principales)
6. [Base de Datos](#base-de-datos)
7. [API REST](#api-rest)
8. [Autenticación](#autenticación)
9. [Sistema de Permisos](#sistema-de-permisos)
10. [Integración con LLM](#integración-con-llm)
11. [Flujos de Usuarios](#flujos-de-usuarios)
12. [Configuración](#configuración)
13. [Instrucciones de Uso](#instrucciones-de-uso)
14. [Troubleshooting](#troubleshooting)

---

## Descripción General

Este es un **Sistema de Gestión de Tareas Inteligente** integrado con un chatbot basado en IA. El proyecto permite a los usuarios crear tableros de tareas, gestionar sus actividades y interactuar con un asistente de IA que ejecuta comandos a través de tool calling.

### Características Principales

✅ **Gestión de Tareas Avanzada**
- Crear, editar, eliminar y completar tareas
- 3 niveles de prioridad (low, medium, high)
- 5 categorías predefinidas (work, personal, shopping, health, other)
- Descripción detallada y fecha de vencimiento
- Soft delete (papelera) y hard delete (eliminación permanente)

✅ **Autenticación y Autorización**
- Registro e inicio de sesión seguro
- JWT tokens en HTTP-only cookies
- Sistema de permisos granular (owner, editor, viewer)

✅ **Chatbot Inteligente**
- Integración con OpenRouter LLM
- Tool calling (5 herramientas: createTask, updateTask, deleteTask, searchTasks, getTaskStats)
- Interpretación automática de contexto (prioridades, categorías)
- Resultados formateados en chat

✅ **Tableros Compartibles**
- Crear múltiples tableros
- Compartir tableros con otros usuarios
- Control de permisos por usuario
- Historial de permisos otorgados

✅ **Configuraciones Personalizadas**
- Intervalo de actualización automática
- Visualización personalizada de tareas
- Tareas por página

---

## Arquitectura del Sistema

### Modelo de Capas

```
┌─────────────────────────────────────────┐
│         Frontend (React)                 │
│  - Componentes UI                       │
│  - Estado Redux                         │
│  - Servicios API                        │
└──────────────┬──────────────────────────┘
               │ HTTP/HTTPS
┌──────────────▼──────────────────────────┐
│      Backend (Express.js)                │
│  ┌─────────────────────────────────┐   │
│  │    Capa de Rutas               │   │
│  │  /api/auth /api/boards /api/chat│  │
│  └────────────┬────────────────────┘   │
│               │                         │
│  ┌────────────▼────────────────────┐   │
│  │   Capa de Controladores        │   │
│  │ AuthController, BoardController│   │
│  │  ChatController, TodoController│   │
│  └────────────┬────────────────────┘   │
│               │                         │
│  ┌────────────▼────────────────────┐   │
│  │   Capa de Servicios            │   │
│  │ AuthService, BoardService      │   │
│  │  ChatService, TodoService      │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│  ┌────────────▼────────────────────┐   │
│  │   Capa de Repositorio          │   │
│  │  Data Access Layer (DAL)       │   │
│  └────────────┬────────────────────┘   │
│               │                         │
└───────────────┼────────────────────────┘
                │
┌───────────────▼────────────────────────┐
│      Base de Datos (SQLite)            │
│  - Usuarios                            │
│  - Tableros                            │
│  - Tareas                              │
│  - Permisos                            │
│  - Configuraciones                     │
└────────────────────────────────────────┘
                │
┌───────────────▼────────────────────────┐
│    Servicios Externos                  │
│  - OpenRouter API (LLM)                │
│  - Sistema de Archivos                 │
└────────────────────────────────────────┘
```

---

## Stack Tecnológico

### Backend
| Tecnología | Versión | Propósito |
|---|---|---|
| **Express.js** | 4.21.2 | Framework web HTTP |
| **TypeScript** | 5.8.3 | Tipado estático |
| **SQLite3** | 5.1.7 | Base de datos relacional |
| **JWT** | 9.0.2 | Autenticación |
| **Bcryptjs** | 3.0.2 | Hash de contraseñas |
| **Cookie-parser** | 1.4.7 | Parseo de cookies |
| **CORS** | 2.8.5 | Control de acceso |
| **node-fetch** | 3.3.2 | HTTP client |
| **ts-node** | 10.9.2 | Ejecución directa de TS |

### Frontend
| Tecnología | Versión | Propósito |
|---|---|---|
| **React** | 18+ | UI Library |
| **TypeScript** | 5.8.3 | Tipado estático |
| **Vite** | - | Build tool |
| **Redux** | - | State management |
| **Tailwind CSS** | - | Estilos |
| **React Router** | - | Enrutamiento |

### Servicios Externos
| Servicio | Propósito |
|---|---|
| **OpenRouter API** | Acceso a múltiples LLMs (GPT-3.5, Claude, etc.) |

---

## Estructura de Carpetas

### Backend (express-api/)

```
express-api/
├── src/
│   ├── index.ts                          # Punto de entrada del servidor
│   ├── db/
│   │   └── connection.ts                 # Conexión a SQLite
│   ├── middleware/
│   │   ├── auth.middleware.ts            # Validación JWT
│   │   ├── error.middleware.ts           # Manejo centralizado de errores
│   │   ├── permissions.middleware.ts     # Verificación de permisos
│   │   ├── request-logger.middleware.ts  # Logging de peticiones
│   │   └── validation.middleware.ts      # Validación de datos
│   ├── modules/
│   │   ├── auth/                         # Módulo de autenticación
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.repository.ts
│   │   ├── board/                        # Módulo de tableros
│   │   │   ├── board.controller.ts
│   │   │   ├── board.service.ts
│   │   │   └── board.repository.ts
│   │   ├── todo/                         # Módulo de tareas
│   │   │   ├── todo.controller.ts
│   │   │   ├── todo.service.ts
│   │   │   └── todo.repository.ts
│   │   ├── permissions/                  # Módulo de permisos
│   │   │   ├── permission.controller.ts
│   │   │   ├── permission.service.ts
│   │   │   └── permission.repository.ts
│   │   └── chat/                         # Módulo de chatbot
│   │       ├── chat.controller.ts
│   │       └── chat.service.ts
│   ├── routes/
│   │   ├── auth.routes.ts                # Rutas de autenticación
│   │   ├── board.routes.ts               # Rutas de tableros
│   │   └── chat.routes.ts                # Rutas del chat
│   ├── scripts/
│   │   ├── init-db.ts                    # Inicializar base de datos
│   │   ├── migrate-add-features.ts       # Migración de nuevos campos
│   │   └── migrate-todos-per-page.ts     # Otra migración
│   └── types/
│       ├── index.ts                      # Tipos principales
│       └── express.d.ts                  # Extensión de tipos Express
├── dist/                                 # Código compilado
├── .env                                  # Variables de entorno
├── package.json
├── tsconfig.json
└── database.sqlite                       # Base de datos

```

### Frontend (react/)

```
react/
├── src/
│   ├── App.tsx                           # Componente principal
│   ├── main.tsx                          # Punto de entrada
│   ├── router.tsx                        # Configuración de rutas
│   ├── types.ts                          # Tipos compartidos
│   ├── components/
│   │   ├── Header.tsx                    # Encabezado
│   │   ├── ChatBot.tsx                   # Chat con IA
│   │   ├── TodosPage.tsx                 # Página de tareas
│   │   ├── BoardsPage.tsx                # Página de tableros
│   │   ├── LoginForm.tsx                 # Formulario de login
│   │   ├── RegisterForm.tsx              # Formulario de registro
│   │   ├── ToDoList.tsx                  # Lista de tareas
│   │   ├── AddToDo.tsx                   # Formulario agregar tarea
│   │   ├── FilterTasks.tsx               # Filtrado de tareas
│   │   ├── Pagination.tsx                # Paginación
│   │   ├── BoardSharing.tsx              # Compartir tableros
│   │   └── ... más componentes
│   ├── hooks/
│   │   ├── useTodos.ts                   # Hook para tareas
│   │   ├── useBoards.ts                  # Hook para tableros
│   │   ├── useTodoMutations.ts           # Hook para mutaciones
│   │   └── ... más hooks
│   ├── services/
│   │   ├── todoService.ts                # API de tareas
│   │   ├── boardServices.ts              # API de tableros
│   │   ├── authService.ts                # API de autenticación
│   │   └── ... más servicios
│   ├── store/
│   │   ├── store.ts                      # Configuración Redux
│   │   ├── hooks.ts                      # Redux hooks tipados
│   │   └── uiSlice.ts                    # Estado UI
│   ├── context/
│   │   └── AuthContext.tsx               # Contexto de autenticación
│   └── pages/
│       ├── index.tsx                     # Página principal
│       ├── settings.tsx                  # Configuraciones
│       └── not-found.tsx                 # 404
├── public/                               # Archivos estáticos
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Componentes Principales

### Backend

#### 1. **Módulo de Autenticación (auth/)**

**Responsabilidades:**
- Registro de nuevos usuarios
- Login con email/contraseña
- Generación de JWT tokens
- Logout y limpieza de cookies
- Obtener usuario actual

**Archivos:**
- `auth.controller.ts` - Maneja peticiones HTTP
- `auth.service.ts` - Lógica de negocio
- `auth.repository.ts` - Acceso a datos

**Endpoints:**
```
POST   /api/auth/register      - Crear cuenta
POST   /api/auth/login         - Iniciar sesión
POST   /api/auth/logout        - Cerrar sesión
GET    /api/auth/me            - Usuario actual (protegido)
GET    /api/auth/users         - Listar usuarios
```

#### 2. **Módulo de Tableros (board/)**

**Responsabilidades:**
- Crear tableros
- Actualizar tableros
- Eliminar tableros
- Obtener tableros del usuario
- Obtener tableros accesibles (propios + compartidos)
- Gestionar permisos de tableros

**Archivos:**
- `board.controller.ts` - Maneja peticiones
- `board.service.ts` - Lógica de negocio
- `board.repository.ts` - Acceso a datos

**Endpoints:**
```
GET    /api/boards             - Tableros propios
GET    /api/boards/accessible  - Tableros accesibles
POST   /api/boards             - Crear tablero
GET    /api/boards/:id         - Obtener tablero
PUT    /api/boards/:id         - Actualizar tablero
DELETE /api/boards/:id         - Eliminar tablero
```

#### 3. **Módulo de Tareas (todo/)**

**Responsabilidades:**
- Crear tareas
- Actualizar tareas
- Eliminar tareas
- Marcar como completada
- Buscar y filtrar tareas
- Paginación
- Soft delete / hard delete
- Estadísticas

**Archivos:**
- `todo.controller.ts` - Maneja peticiones
- `todo.service.ts` - Lógica de negocio
- `todo.repository.ts` - Acceso a datos (incluyendo filtrado avanzado)

**Endpoints:**
```
GET    /api/boards/:boardId/todos                    - Listar tareas
POST   /api/boards/:boardId/todos                    - Crear tarea
GET    /api/boards/:boardId/todos/:id                - Obtener tarea
PUT    /api/boards/:boardId/todos/:id                - Actualizar
PATCH  /api/boards/:boardId/todos/:id/toggle         - Marcar completada
DELETE /api/boards/:boardId/todos/:id                - Eliminar tarea
DELETE /api/boards/:boardId/todos/clear-completed    - Limpiar completadas
```

#### 4. **Módulo de Permisos (permissions/)**

**Responsabilidades:**
- Compartir tableros con usuarios
- Actualizar permisos
- Eliminar permisos
- Listar permisos de un tablero
- Verificar permisos de usuario

**Archivos:**
- `permission.controller.ts`
- `permission.service.ts`
- `permission.repository.ts`

**Endpoints:**
```
POST   /api/boards/:boardId/share                    - Compartir tablero
GET    /api/boards/:boardId/permissions              - Listar permisos
PUT    /api/boards/:boardId/permissions/:userId      - Actualizar permiso
DELETE /api/boards/:boardId/permissions/:userId      - Eliminar permiso
```

#### 5. **Módulo de Chat (chat/)**

**Responsabilidades:**
- Procesar mensajes del usuario
- Llamar a OpenRouter API
- Ejecutar tool calls (createTask, updateTask, etc.)
- Formatear respuestas
- Interpretación de contexto

**Archivos:**
- `chat.controller.ts` - Maneja peticiones
- `chat.service.ts` - Lógica de LLM y tools

**Endpoints:**
```
POST   /api/chat/message       - Enviar mensaje al chatbot
```

### Frontend

#### 1. **Componentes Principales**

**ChatBot.tsx**
- Interface del chat con IA
- Historial de conversación
- Envío de mensajes
- Integración con backend

**TodosPage.tsx**
- Página principal de tareas
- Usa filtros, búsqueda y paginación
- Integra AddToDo, ToDoList, FilterTasks

**BoardsPage.tsx**
- Gestión de tableros
- Crear, eliminar, actualizar tableros
- Compartir tableros

**LoginForm.tsx / RegisterForm.tsx**
- Autenticación de usuarios
- Validación de formularios
- Manejo de errores

#### 2. **Hooks Personalizados**

**useTodos()**
- Obtener tareas del tablero actual
- Filtrado y paginación
- Refresh automático

**useBoards()**
- Obtener tableros accesibles
- Crear/eliminar tableros

**useTodoMutations()**
- Crear tarea
- Actualizar tarea
- Eliminar tarea
- Marcar completada

#### 3. **Servicios API**

**todoService.ts**
```typescript
getTodos(boardId, filters?)        // Obtener tareas
createTodo(boardId, data)          // Crear tarea
updateTodo(boardId, id, data)      // Actualizar
deleteTodo(boardId, id)            // Eliminar
toggleTodo(boardId, id)            // Marcar completada
clearCompleted(boardId)            // Limpiar completadas
```

**boardServices.ts**
```typescript
getBoards()                        // Obtener tableros del usuario
getAccessibleBoards()              // Obtener todos accesibles
createBoard(name)                  // Crear tablero
updateBoard(id, name)              // Actualizar
deleteBoard(id)                    // Eliminar
shareBoard(boardId, email, perm)   // Compartir
getPermissions(boardId)            // Obtener permisos
```

**authService.ts**
```typescript
register(data)                     // Registrar usuario
login(email, password)             // Iniciar sesión
logout()                           // Cerrar sesión
getCurrentUser()                   // Usuario actual
getUsers()                         // Listar usuarios
```

---

## Base de Datos

### Esquema Relacional

#### Tabla: `users`
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Campos:**
- `id` - ID único del usuario
- `username` - Nombre único (3-20 caracteres, alfanumérico + _)
- `email` - Email único válido
- `password_hash` - Contraseña hasheada con bcryptjs
- `created_at` - Timestamp de creación
- `updated_at` - Timestamp de actualización

---

#### Tabla: `boards`
```sql
CREATE TABLE boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    owner_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);
```

**Campos:**
- `id` - ID único del tablero
- `name` - Nombre del tablero
- `owner_id` - ID del usuario propietario
- `created_at` / `updated_at` - Timestamps

---

#### Tabla: `todos`
```sql
CREATE TABLE todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    category TEXT,
    due_date DATETIME,
    is_deleted BOOLEAN DEFAULT 0,
    deleted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id)
);
```

**Campos Nuevos (Avanzados):**
- `description` - Descripción detallada de la tarea
- `priority` - 'low', 'medium', 'high'
- `category` - 'work', 'personal', 'shopping', 'health', 'other'
- `due_date` - Fecha de vencimiento (ISO 8601)
- `is_deleted` - Flag para soft delete
- `deleted_at` - Timestamp de eliminación (soft delete)

---

#### Tabla: `board_permissions`
```sql
CREATE TABLE board_permissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    permission_level TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(board_id, user_id)
);
```

**Campos:**
- `id` - ID único del permiso
- `board_id` - Tablero afectado
- `user_id` - Usuario que recibe permisos
- `permission_level` - 'owner', 'editor', 'viewer'
- `created_at` - Cuándo se otorgó

---

#### Tabla: `user_settings`
```sql
CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    refresh_interval INTEGER DEFAULT 5000,
    uppercase_descriptions BOOLEAN DEFAULT 0,
    todos_per_page INTEGER DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

**Campos:**
- `refresh_interval` - Intervalo de actualización en ms
- `uppercase_descriptions` - ¿Mostrar descripciones en mayúsculas?
- `todos_per_page` - Tareas por página (paginación)

---

### Relaciones

```
users (1) ──────────────> (many) boards
           owner_id (FK)

users (1) ──────────────> (many) board_permissions
           user_id (FK)

boards (1) ─────────────> (many) board_permissions
            board_id (FK)

boards (1) ─────────────> (many) todos
           board_id (FK)

users (1) ──────────────> (1) user_settings
          user_id (FK)
```

---

### Índices para Optimización

```sql
CREATE INDEX idx_boards_owner_id ON boards(owner_id);
CREATE INDEX idx_todos_board_id ON todos(board_id);
CREATE INDEX idx_todos_completed ON todos(board_id, completed);
CREATE INDEX idx_todos_priority ON todos(board_id, priority);
CREATE INDEX idx_board_permissions_user_id ON board_permissions(user_id);
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);
```

---

## API REST

### Estructura de Respuestas

#### Éxito (2xx)
```json
{
  "data": { /* objeto o array */ },
  "message": "Operación exitosa"
}
```

#### Error (4xx/5xx)
```json
{
  "error": "Descripción del error",
  "details": "Información adicional",
  "statusCode": 400
}
```

---

### Autenticación de Endpoints

**Leyenda:**
- 🔓 Público (sin autenticación)
- 🔒 Protegido (requiere JWT)
- 👁️ Requiere permiso de visualización
- ✏️ Requiere permiso de edición
- 👑 Requiere ownership

### Endpoints de Autenticación (🔓 + 🔒)

```
POST /api/auth/register
  → Crear cuenta nueva
  
POST /api/auth/login
  → Iniciar sesión con email/contraseña
  
POST /api/auth/logout 🔒
  → Cerrar sesión
  
GET /api/auth/me 🔒
  → Obtener usuario actual
  
GET /api/auth/users 🔒
  → Listar todos los usuarios
  
GET /api/auth/settings 🔒
  → Obtener configuraciones del usuario
  
PUT /api/auth/settings 🔒
  → Actualizar configuraciones
  
GET /api/auth/boards 🔒
  → Obtener tableros accesibles (propios + compartidos)
```

---

### Endpoints de Tableros (🔒)

```
GET /api/boards
  → Obtener tableros propios del usuario
  
GET /api/boards/accessible
  → Obtener todos los tableros accesibles (propios + compartidos)
  → Incluye información de permisos
  
POST /api/boards
  → Crear nuevo tablero
  ✏️ body: { name: string }
  
GET /api/boards/:boardId
  → Obtener un tablero específico
  
PUT /api/boards/:boardId 👁️
  → Actualizar tablero
  ✏️ body: { name: string }
  
DELETE /api/boards/:boardId 👑
  → Eliminar tablero (solo propietario)
```

---

### Endpoints de Tareas (🔒)

```
GET /api/boards/:boardId/todos 👁️
  → Listar tareas del tablero con filtros
  ? filter=all|completed|uncompleted
  ? priority=low|medium|high
  ? category=work|personal|shopping|health|other
  ? search=texto
  ? page=1
  ? limit=10
  
POST /api/boards/:boardId/todos ✏️
  → Crear tarea
  body: { 
    text: string,
    priority?: 'low'|'medium'|'high',
    category?: 'work'|'personal'|'shopping'|'health'|'other',
    description?: string,
    due_date?: ISO8601
  }
  
GET /api/boards/:boardId/todos/:id 👁️
  → Obtener tarea específica
  
PUT /api/boards/:boardId/todos/:id ✏️
  → Actualizar tarea
  body: { text?, priority?, category?, description?, due_date? }
  
PATCH /api/boards/:boardId/todos/:id/toggle ✏️
  → Marcar como completada/incompleta
  
DELETE /api/boards/:boardId/todos/:id ✏️
  → Eliminar tarea (soft delete por defecto)
  ? permanently=true  (para hard delete)
  
DELETE /api/boards/:boardId/todos/clear-completed ✏️
  → Eliminar todas las tareas completadas
```

---

### Endpoints de Permisos (🔒)

```
POST /api/boards/:boardId/share 👑
  → Compartir tablero con usuario
  body: { email: string, permission_level: 'editor'|'viewer' }
  
GET /api/boards/:boardId/permissions 👁️
  → Listar permisos del tablero
  
PUT /api/boards/:boardId/permissions/:userId 👑
  → Actualizar permiso de usuario
  body: { permission_level: 'editor'|'viewer' }
  
DELETE /api/boards/:boardId/permissions/:userId 👑
  → Eliminar permiso de usuario
```

---

### Endpoints del Chat (🔒)

```
POST /api/chat/message
  → Enviar mensaje al chatbot
  body: {
    message: string,
    boardId: number,
    conversationId?: string
  }
```

---

## Autenticación

### Sistema JWT con HTTP-Only Cookies

#### Flujo de Autenticación

1. **Registro**
   - Usuario envía: username, email, password
   - Backend hashea contraseña con bcryptjs
   - Crea registro en tabla `users`
   - Retorna usuario creado

2. **Login**
   - Usuario envía: email, password
   - Backend verifica credenciales
   - Genera JWT token
   - Envía token en HTTP-only cookie (seguro, no accessible desde JS)
   - Cookie se envía automáticamente en cada request

3. **Peticiones Protegidas**
   - Middleware extrae JWT de la cookie
   - Verifica firma del token
   - Valida no esté expirado
   - Adjunta usuario a req.user

4. **Logout**
   - Backend limpia la cookie
   - Usuario debe autenticarse nuevamente

#### Configuración

**Variables de Entorno (.env):**
```env
JWT_SECRET=tu_clave_secreta_super_segura_para_jwt_tokens_2024
NODE_ENV=development
PORT=3001
```

**JWT Token Payload:**
```typescript
{
  userId: number,
  email: string,
  username: string,
  iat: number,  // Issued at
  exp: number   // Expiration time
}
```

#### Seguridad

✅ **Contraseñas:**
- Hasheadas con bcryptjs (10 salt rounds)
- Nunca se almacenan en texto plano
- Nunca se devuelven en respuestas API

✅ **Tokens:**
- Almacenados en HTTP-only cookies
- No accesibles desde JavaScript
- Protegidos contra XSS
- Transmitidos automáticamente en CORS

✅ **Validación:**
- Email único
- Username único
- Password con requisitos mínimos
- Sanitización de inputs

---

## Sistema de Permisos

### Niveles de Permisos

#### 1. **Owner** 👑 (Propietario)
- Control total del tablero
- Puede crear, editar, eliminar tareas
- Puede compartir tablero
- Puede cambiar permisos de otros usuarios
- Puede eliminar tablero
- **Heredado automáticamente** por el creador del tablero

#### 2. **Editor** ✏️ (Editor)
- Puede crear, editar, eliminar tareas
- Puede ver el tablero y tareas
- No puede compartir
- No puede cambiar permisos
- No puede eliminar tablero

#### 3. **Viewer** 👁️ (Visualizador)
- Solo lectura
- Puede ver tablero y tareas
- No puede crear/editar/eliminar tareas
- No puede compartir
- No puede cambiar permisos

### Verificación de Permisos

**Middleware `permissions.middleware.ts`:**
```typescript
// Verificar que el usuario tiene acceso al tablero
async (req, res, next) => {
  const boardId = req.params.boardId;
  const userId = req.user.id;
  
  // Obtener permiso del usuario para este tablero
  const permission = await getPermission(userId, boardId);
  
  if (!permission) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Verificar que tiene el nivel necesario
  if (permission < requiredLevel) {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }
  
  next();
}
```

### Matriz de Permisos

| Acción | Owner | Editor | Viewer |
|--------|-------|--------|--------|
| Ver tablero | ✅ | ✅ | ✅ |
| Ver tareas | ✅ | ✅ | ✅ |
| Crear tarea | ✅ | ✅ | ❌ |
| Editar tarea | ✅ | ✅ | ❌ |
| Eliminar tarea | ✅ | ✅ | ❌ |
| Actualizar tablero | ✅ | ✅ | ❌ |
| Eliminar tablero | ✅ | ❌ | ❌ |
| Compartir tablero | ✅ | ❌ | ❌ |
| Cambiar permisos | ✅ | ❌ | ❌ |

---

## Integración con LLM

### OpenRouter API

#### Configuración

**Variables de Entorno:**
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=gpt-3.5-turbo  # o cualquier otro modelo disponible
```

#### Modelos Disponibles

- gpt-3.5-turbo (rápido, económico)
- gpt-4 (más potente)
- claude-2 (análisis profundo)
- mistral (código)
- llama2 (código abierto)

---

### Tool Calling (Function Calling)

El LLM puede ejecutar 5 herramientas (tools) para manipular tareas:

#### 1. **createTask**
Crea una nueva tarea en un tablero
```typescript
{
  text: string,              // REQUERIDO: título de tarea
  boardId: number,           // REQUERIDO: ID del tablero
  priority?: 'low' | 'medium' | 'high',  // Opcional
  category?: 'work' | 'personal' | 'shopping' | 'health' | 'other',
  description?: string,      // Opcional
  due_date?: string          // Opcional (ISO 8601)
}
```

**Ejemplo en chat:**
```
Usuario: "Crea una tarea urgente: comprar café, categoría shopping"
LLM: ✅ Tarea creada: "comprar café" 🔴 (Prioridad: high [shopping])
```

#### 2. **updateTask**
Actualiza una tarea existente
```typescript
{
  todoId: number,            // REQUERIDO: ID de la tarea
  boardId: number,           // REQUERIDO: ID del tablero
  text?: string,             // Opcional
  priority?: string,         // Opcional
  category?: string,         // Opcional
  description?: string,      // Opcional
  due_date?: string,         // Opcional
  completed?: boolean        // Opcional
}
```

#### 3. **deleteTask**
Elimina una tarea (soft delete por defecto)
```typescript
{
  todoId: number,            // REQUERIDO
  boardId: number,           // REQUERIDO
  permanently?: boolean      // false = soft delete, true = hard delete
}
```

#### 4. **searchTasks**
Busca y filtra tareas
```typescript
{
  boardId: number,           // REQUERIDO
  search?: string,           // Buscar en título/descripción
  priority?: string,         // Filtrar por prioridad
  category?: string,         // Filtrar por categoría
  completed?: boolean,       // Filtrar por estado
  sort_by?: string,          // created_at, due_date, priority, text
  sort_order?: 'asc' | 'desc'
}
```

**Respuesta formateada:**
```
📋 Encontradas 2 tarea(s):

1. ⏳ 🔴 **comprar café** [shopping]
   └─ en starbucks a las 3pm

2. ✅ 🟡 **hacer ejercicio** [personal]
```

#### 5. **getTaskStats**
Obtiene estadísticas de tareas
```typescript
{
  boardId: number            // REQUERIDO
}
```

**Respuesta:**
```
📊 Estadísticas del Tablero:

📈 Resumen:
  • Total: 15 tareas
  • ✅ Completadas: 10
  • ⏳ Pendientes: 5
  • 📊 Tasa: 67%

🔴 Por Prioridad:
  • Alta: 2/3
  • Media: 4/6
  • Baja: 4/4

🏷️ Por Categoría:
  • shopping: 3/3
  • work: 2/4
  • personal: 2/3
```

---

### Interpretación Automática del Contexto

El system prompt instruye al LLM para interpretar automáticamente:

#### Prioridades
- "urgente", "importante", "crítico", "asap" → `priority: "high"`
- "normal", "regular" → `priority: "medium"` (default)
- "puede esperar", "low priority" → `priority: "low"`

#### Categorías
- "trabajo", "laboral", "proyecto" → `category: "work"`
- "personal", "privado" → `category: "personal"`
- "compra", "compras", "tienda" → `category: "shopping"`
- "salud", "médico", "ejercicio" → `category: "health"`
- Otra → `category: "other"` o sin categoría

---

### Flujo de Procesamiento de Mensajes

```
Usuario escribe mensaje
        ↓
Frontend envía a /api/chat/message
        ↓
Backend: ChatService.processMessage()
        ↓
Llamar OpenRouter API con:
  - Historial de conversación
  - System prompt
  - Definiciones de tools
        ↓
LLM decide si ejecutar tools
        ↓
SI: Ejecutar tool calls
  - Validar parámetros
  - Ejecutar función
  - Retornar resultado al LLM
        ↓
LLM genera respuesta final
        ↓
Enviar respuesta al usuario
        ↓
Frontend muestra en chat
```

---

## Flujos de Usuarios

### Flujo 1: Registrarse y Crear Primer Tablero

```
1. Usuario abre la app → Ve Login/Register
2. Hace clic en "Registrar"
3. Completa: username, email, password
4. Backend crea usuario + user_settings (defaults)
5. Frontend redirige a login
6. Inicia sesión con email/password
7. Backend genera JWT token
8. Frontend navega a /boards
9. Ve "No hay tableros"
10. Hace clic en "+ Nuevo Tablero"
11. Completa nombre
12. Backend crea tablero (owner_id = user.id)
13. Se redirige a /todos (tablero seleccionado)
```

---

### Flujo 2: Crear Tarea con Chatbot

```
1. Usuario está en /todos con un tablero seleccionado
2. Ve chat en sidebar
3. Escribe: "Crea una tarea: comprar café, prioridad alta"
4. Frontend envía: {
     message: "Crea una tarea...",
     boardId: 1
   }
5. Backend recibe en /api/chat/message
6. ChatService.processMessage():
   - Envía a OpenRouter con historial
   - OpenRouter responde con tool_call para createTask
   - Extrae parámetros: { text: "comprar café", priority: "high", boardId: 1 }
   - Llama todoRepository.createTodo()
   - BD crea registro
   - Retorna resultado al LLM
7. LLM genera respuesta: "✅ Tarea creada..."
8. Frontend recibe respuesta
9. Actualiza lista de tareas (useEffect refetch)
10. Usuario ve nueva tarea en la lista
```

---

### Flujo 3: Compartir Tablero

```
1. Usuario propietario en /boards
2. Hace clic en "Compartir" en tablero
3. Se abre modal de compartir
4. Ingresa email del usuario destino
5. Selecciona nivel: "editor" o "viewer"
6. Hace clic en "Compartir"
7. Frontend: POST /api/boards/:id/share
8. Backend crea registro en board_permissions
9. Usuario destino puede ver tablero en su lista (accesible)
10. Si es "editor": puede crear/editar tareas
11. Si es "viewer": solo lectura
```

---

### Flujo 4: Usar Filtros y Búsqueda

```
1. Usuario en /todos
2. Ve componente FilterTasks
3. Selecciona:
   - Priority: "high"
   - Category: "work"
   - Estado: "uncompleted"
   - Búsqueda: "proyecto"
4. Frontend arma query: /api/boards/:id/todos?priority=high&category=work&completed=false&search=proyecto
5. Backend en TodoRepository.getAllTodos():
   - Filtra por board_id
   - Filtra por priority='high'
   - Filtra por category='work'
   - Filtra por completed=0
   - Busca en text LIKE '%proyecto%' o description LIKE '%proyecto%'
   - Retorna tareas coincidentes + info de paginación
6. Frontend muestra resultados
7. Cuando hay muchos resultados:
   - Muestra paginación
   - Usuario puede navegar entre páginas
   - Actualiza query con ?page=2
```

---

## Configuración

### Variables de Entorno

**Backend (.env):**
```env
# Base de Datos
DATABASE_URL=./database.sqlite

# Servidor
PORT=3001
NODE_ENV=development

# Autenticación
JWT_SECRET=tu_clave_secreta_super_segura_para_jwt_tokens_2024

# CORS (Frontend)
CORS_ORIGIN=http://localhost:5173

# LLM
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxx
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=gpt-3.5-turbo
OPENROUTER_REFERRER=http://localhost:3001
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

---

### Inicializar la Base de Datos

```bash
cd express-api
npm run init-db
```

Esto:
1. Crea `database.sqlite`
2. Crea todas las tablas
3. Inserta datos de prueba:
   - 3 usuarios
   - 2 tableros
   - Algunas tareas
   - Permisos

---

## Instrucciones de Uso

### Instalación Completa

```bash
# 1. Clonar/navegar al proyecto
cd exercises/13-\ Chatbot/8-\ Advanced\ Backend

# 2. Backend
cd express-api
npm install
npm run init-db
npm run dev

# 3. Frontend (en otra terminal)
cd ../react
npm install
npm run dev

# 4. Abrir navegador
http://localhost:5173
```

---

### Primer Uso

1. **Registrarse**
   - Email: `user@example.com`
   - Password: alguna contraseña
   - Username: un nombre único

2. **Crear Tablero**
   - Nombre: "Mi Primer Tablero"
   - Automáticamente eres owner

3. **Crear Tareas**
   - Opción 1: Click en "+ Agregar Tarea"
   - Opción 2: Chat: "crea una tarea: ejemplo"

4. **Usar Chat**
   - Escribe: "muéstrame mis tareas de trabajo"
   - O: "marca como completada la tarea X"

5. **Compartir**
   - Click en tablero
   - Botón "Compartir"
   - Ingresa email de otro usuario

---

## Troubleshooting

### Backend no inicia

**Error: "Error: ENOENT: no such file or directory, open 'database.sqlite'"**

```bash
# Solución: Inicializar base de datos
npm run init-db
npm run dev
```

---

### CORS error

**Error: "Access to XMLHttpRequest from origin 'http://localhost:5173' blocked"**

**Solución:** Verificar `.env`:
```env
CORS_ORIGIN=http://localhost:5173
```

Si usando otro puerto:
```env
CORS_ORIGIN=http://localhost:5174
```

---

### JWT no válido

**Error: "401 Unauthorized - Invalid token"**

**Soluciones:**
1. Limpiar cookies del navegador (DevTools → Storage)
2. Cerrar sesión y volver a iniciar
3. Verificar `JWT_SECRET` en `.env` sea idéntico en todas partes

---

### Chat no funciona

**Error: "OpenRouter API error"**

**Soluciones:**
1. Verificar `OPENROUTER_API_KEY` en `.env`
2. Verificar que tienes saldo/créditos en OpenRouter
3. Verificar `OPENROUTER_MODEL` sea válido
4. Revisar logs del backend con detalle

---

### Tool call no ejecuta

**El LLM no ejecuta createTask/updateTask/etc**

**Causas:**
1. El `boardId` no se está inyectando correctamente
2. El system prompt no es suficiente
3. El LLM no reconoce los parámetros

**Solución:**
- Revisar logs: `[TOOL] Executing tool: ...`
- Agregar más contexto al system prompt
- Usar ejemplo: "crea una tarea: X, categoría Y, prioridad Z"

---

### Migraciones fallan

**Error: "Column 'priority' already exists"**

**Solución:**
- La migración ya se ejecutó
- Es seguro ignorar
- Las columnas ya están en la BD

---

## Resumen

Este proyecto es un **sistema completo de gestión de tareas** con:

✅ Backend robusto con Express.js  
✅ Autenticación JWT segura  
✅ Base de datos relacional  
✅ Sistema de permisos granular  
✅ Chatbot inteligente con IA  
✅ Herramientas de automatización (tools)  
✅ Filtrado y búsqueda avanzados  
✅ Frontend React moderno  

**Próximos pasos:**
1. Ejecutar `npm run migrate:features` (si no lo hiciste)
2. Probar en el chat: "crea una tarea urgente"
3. Compartir un tablero con otro usuario
4. Explorar los filtros y estadísticas

---

**¡Documentación completada! 📚**
