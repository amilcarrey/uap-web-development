# 2.DO --- Documentación

## Descripción

Aplicación fullstack para la gestión de tareas con autenticación, autorización, tableros colaborativos y configuración personalizada.  
Las tecnologías utilizadas para desarrollar el backend fueron Express, Knex y SQLite. Para el frontend, React y Vite, Zustand, Axios, TanStack React Query, Tailwind CSS y React Icons.

---

## Inicialización del Proyecto

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
cd christian-barreto-2
```

### 2. Instalar dependencias
cd backend
npm install

cd ../tareas-react
npm install

### Configurar la base de datos
El backend usa SQLite y ya está configurado para ser desarrollado. Para crear las tablas, se utiliza knex: 

cd ../backend
npx knex migrate:latest --knexfile 

### 4. Iniciar el backend
npx ts-node src/server.ts

El backend debe correr en https://localhost:8008.

### 5. Iniciar el frontend
cd ../tareas-react
npm run dev

El frontend corre en http://localhost:5173


--- 

## Endpoints principales de la API
Todas las rutas, con la excepción del login y del register, requieren autenticación mediante JWT en cookie httpOnly.

### Autenticación
#### POST /api/auth/register
Crea un usuario.
Body: { "nombre": string, "email": string, "password": string }

#### POST /api/auth/login
Inicia sesión.
Body: { "nombre"?: string, "email"?: string, "password": string }

#### POST /api/auth/logout
Cierra sesión.

#### GET /api/auth/me
Devuelve los datos del usuario autenticado.

#### DELETE /api/auth/cuenta
Elimina la cuenta y todos los datos asociados.

### Tableros
#### GET /api/tableros
Lista los tableros donde el usuario tiene acceso.

#### POST /api/tableros
Crea un tablero.
Body: { "nombre": string }

#### DELETE /api/tableros/:id
Elimina un tablero (solo propietario).

#### POST /api/tableros/:tableroId/compartir
Comparte el tablero con otro usuario.
Body: { "usuario": string, "rol": "lector" | "editor" }

#### GET /api/tableros/:tableroId/usuarios
Lista los usuarios con acceso al tablero.

#### DELETE /api/tableros/:tableroId/colaboradores/:usuarioId
Elimina un colaborador del tablero.

#### GET /api/tableros/:tableroId/rol
Devuelve el rol del usuario en el tablero.

### Tareas
#### GET /api/tareas?tableroId=ID&pagina=N&porPagina=M
Lista tareas de un tablero (soporta paginación y búsqueda).

#### POST /api/tareas
Crea una tarea.
Body: { "texto": string, "tableroId": string }

#### PATCH /api/tareas/:id
Modifica una tarea.
Body: { "texto"?: string, "completada"?: boolean }

#### PATCH /api/tareas/:id/completar
Marca una tarea como completada/incompleta.

#### DELETE /api/tareas/:id
Elimina una tarea.

#### DELETE /api/tareas?tableroId=ID
Elimina todas las tareas completadas del tablero.

### Configuración de usuario
GET /api/config
Obtiene la configuración del usuario.

POST /api/config
Guarda la configuración.
Body: { intervaloRefetch, tareasPorPagina, descripcionMayusculas, tareaBgColor, fondoActual }

### Fondos de usuario+
#### GET /api/fondos
Lista los fondos del usuario.

#### POST /api/fondos
Agrega un fondo.
Body: { url: string }

#### DELETE /api/fondos/:id
Elimina un fondo.

---

## Ejemplos de uso de la API

### Autenticación

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "dylan",
  "email": "dylan@mail.com",
  "password": "123456"
}
```

#### Iniciar sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "nombre": "dylan",
  "password": "123456"
}
```

#### Cerrar sesión
```http
POST /api/auth/logout
```

#### Obtener usuario autenticado
```http
GET /api/auth/me
```

#### Eliminar cuenta
```http
DELETE /api/auth/cuenta
```

### Tableros

#### Listar Tableros
```http
GET /api/tableros
```

#### Crear tablero
```http
POST /api/tableros
Content-Type: application/json

{
  "nombre": "Trabajo"
}
```

#### Eliminar tablero
```http
DELETE /api/tableros/ID_DEL_TABLERO
```

#### Compartir tablero
```http
POST /api/tableros/ID_DEL_TABLERO/compartir
Content-Type: application/json

{
  "usuario": "cucho",
  "rol": "editor"
}
```

#### Listar usuarios con acceso
```http
GET /api/tableros/ID_DEL_TABLERO/usuarios
```

#### Eliminar colaborador
```http
DELETE /api/tableros/ID_DEL_TABLERO/colaboradores/ID_USUARIO
```

#### Obtener rol en tablero
```http
GET /api/tableros/ID_DEL_TABLERO/rol
```

### Tareas

#### Listar tareas (con paginación)
```http

```

#### Crear tarea
```http
POST /api/tareas
Content-Type: application/json

{
  "texto": "ganar el intercarreras",
  "tableroId": "ID_DEL_TABLERO"
}
```

#### Modificar tarea
```http
PATCH /api/tareas/ID_TAREA
Content-Type: application/json

{
  "texto": "ganar un partido del intercarreras"
}
```

#### Completar tarea
```http
PATCH /api/tareas/ID_TAREA/completar
Content-Type: application/json

{
  "completada": true
}
```

#### Eliminar tarea
```http
DELETE /api/tareas/ID_TAREA
```

#### Eliminar todas las tareas completadas
```http
DELETE /api/tareas?tableroId=ID_DEL_TABLERO
```

### Configuración de usuario

#### Obtener configuración
```http
GET /api/config
```

#### Guardar configuración
```http
POST /api/config
Content-Type: application/json

{
  "intervaloRefetch": 10000,
  "tareasPorPagina": 5,
  "descripcionMayusculas": false,
  "tareaBgColor": "#111827",
  "fondoActual": "https://ejemplo.com/fondo.jpg"
}
```

### Fondos de usuario

#### Listar fondos
```http
GET /api/fondos
```

#### Agregar fondo
```http
POST /api/fondos
Content-Type: application/json

{
  "url": "https://ejemplo.com/fondo.jpg"
}
```

#### Eliminar fondo
```http
DELETE /api/fondos/ID_FONDO
```

--- 

## Usuarios ejemplo

### Dylan
Usuario: dylan
Contraseña: dylan

#### Tableros de Dylan
dylan 1: tarea, tarea 2 al 6.
Permisos: dylan (propietario)
Configuración: 3 tareas por página, refetch cada 10 segundos, tareas rojas


### Luca
Usuario: luca
Contraseña: luca

#### Tableros de Luca
luca 1: tarea, tarea 1 al 6 
Permisos: luca (propietario), dylan (lector)
Configuración: 4 tareas por página, refetch cada 5 segundos, tareas amarillas

### Cucho
Usuario: cucho
Contraseña: cucho

#### Tableros de Cucho
luca 1: tarea 1 al 6 
Permisos: cucho (propietario), luca (lector), dylan (editor)
Configuración: 2 tareas por página, refetch cada 10 segundos, tareas grises