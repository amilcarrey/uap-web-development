# Task Manager App - Proyecto de Gestión de Tareas y Tableros

## Descripción general

Aplicación de gestión de tareas multiusuario con control de acceso. Permite crear tableros colaborativos, agregar tareas, compartirlos con diferentes niveles de permisos y configurar preferencias personales. Desarrollada con una arquitectura cliente-servidor que integra React en el frontend y Express con SQLite en el backend.

---

## Funcionalidades principales

### Autenticación y seguridad
- Registro e inicio de sesión de usuarios
- Autenticación con JWT en cookies HTTP-only
- Protección de rutas mediante middleware
- Cierre de sesión seguro

### Tareas
- Crear, editar, eliminar tareas
- Marcar tareas como completadas o pendientes
- Borrar tareas completadas en lote
- Paginación, filtrado por estado y búsqueda por texto

### Tableros
- Crear, editar, eliminar tableros
- Compartir tableros con otros usuarios a traves del email registrado
- Asignar y modificar roles: propietario, editor, lector
- Listar usuarios con acceso y sus roles

### Configuración de usuario
- Intervalo de actualización automática de tareas
- Cantidad de tareas por página
- Visualización en mayúsculas
- Configuración persistente en la base de datos

---

## Documentación de la API REST

### Autenticación (`/api/auth`)
- `POST /registro`: Crear usuario
- `POST /login`: Iniciar sesión
- `POST /logout`: Cerrar sesión
- `GET /test`: Verificar token y obtener datos del usuario

### Tareas (`/api/tareas`)
- `GET /`: Obtener tareas con filtros (`?filtro=&pagina=&limit=&tableroId=`)
- `POST /`: Crear nueva tarea
- `PUT /:id`: Editar texto de una tarea
- `PUT /:id/toggle`: Cambiar estado completado
- `DELETE /:id`: Borrar una tarea
- `DELETE /limpiar/:tableroId`: Borrar tareas completadas de un tablero

### Tableros (`/api/tableros`)
- `GET /`: Obtener tableros del usuario
- `POST /`: Crear nuevo tablero
- `GET /:id`: Obtener tablero por ID (si tiene permiso)
- `PUT /:id`: Editar nombre del tablero
- `DELETE /:id`: Eliminar tablero (solo propietario)
- `POST /compartir`: Compartir tablero con usuario
- `PUT /modificarPermiso`: Modificar rol de usuario compartido
- `GET /:id/usuarios`: Obtener lista de usuarios con acceso al tablero

### Configuración (`/api/config`)
- `GET /`: Obtener configuración del usuario actual
- `PUT /`: Guardar configuración del usuario actual

---

## Instrucciones para ejecución local

### 1. Clonar el repositorio

```bash
git clone <URL-del-repo>
cd TareasReact/to-do-next-ts
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Base de datos SQLite se crea automáticamente en `data/database.db`.

### 3. Frontend

```bash
cd ../
npm install
npm run dev
```

Abrir en navegador: `http://localhost:3000`