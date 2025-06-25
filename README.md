# uap-web-development

## Descripción General

Esta aplicación es un gestor de tableros y tareas colaborativo, desarrollado con React en el frontend y Express.js en el backend, utilizando una base de datos relacional (SQLite). Permite a los usuarios crear tableros, compartirlos, gestionar tareas y personalizar su experiencia, todo con autenticación y autorización seguras.

---

## Características Principales
- **Registro e inicio de sesión seguro** (JWT en cookies HTTP-only, contraseñas hasheadas)
- **Gestión de tableros**: crear, compartir, eliminar, asignar permisos (propietario, editor, solo lectura)
- **Gestión de tareas**: crear, editar, eliminar, completar, filtrar, buscar, paginar
- **Configuraciones personalizadas**: intervalo de actualización, tareas por página, visualización personalizada
- **Permisos granulares**: control de acceso a tableros y tareas según rol
- **Persistencia en base de datos relacional**
- **API RESTful documentada y segura**

---

## Instalación y Ejecución

1. Clonar el repositorio
2. Instalar dependencias en backend y frontend
3. Iniciar el backend (`cd Backend && npm install && npm start`)
4. Iniciar el frontend (`cd toDo-vite && npm install && npm run dev`)

---

## Endpoints Principales de la API

### Autenticación
- `POST /api/auth/register` — Registro de usuario
- `POST /api/auth/login` — Login (JWT en cookie)
- `POST /api/auth/logout` — Logout

### Usuarios
- `GET /api/users/me` — Obtener datos del usuario autenticado
- `GET /api/users/me/settings` — Obtener configuraciones del usuario
- `PUT /api/users/me/settings` — Actualizar configuraciones

### Tableros
- `GET /api/boards` — Listar tableros del usuario
- `POST /api/boards` — Crear tablero
- `DELETE /api/boards/:boardId` — Eliminar tablero
- `GET /api/boards/:boardId/users` — Listar usuarios y permisos de un tablero
- `POST /api/boards/:boardId/users` — Compartir tablero/agregar usuario
- `DELETE /api/boards/:boardId/users/:userId` — Quitar usuario de tablero

### Tareas
- `GET /api/tasks/:boardId?page=1&limit=5&filter=all&search=palabra` — Listar tareas (paginadas, filtradas, búsqueda)
- `POST /api/tasks/:boardId` — Crear tarea
- `PATCH /api/tasks/:taskId` — Editar tarea
- `PATCH /api/tasks/:taskId/complete` — Completar tarea
- `DELETE /api/tasks/:taskId` — Eliminar tarea
- `DELETE /api/tasks/:boardId/clear-completed` — Eliminar todas las tareas completadas

---

## Ejemplo de Flujo de Uso
1. El usuario se registra e inicia sesión.
2. Crea un tablero y lo comparte con otros usuarios, asignando permisos.
3. Agrega tareas, las edita, filtra y busca según necesidad.
4. Personaliza la experiencia desde la página de configuraciones.
5. Solo los propietarios pueden eliminar tableros o cambiar permisos.
6. Todas las acciones requieren autenticación y se validan los permisos en cada endpoint.

---

## Seguridad
- Contraseñas hasheadas con bcrypt
- JWT en cookies HTTP-only
- Validación y sanitización de entradas
- CORS configurado
- Middlewares de autenticación y autorización

---

## Ejemplo de Request y Response

### Crear tarea
**POST** `/api/tasks/:boardId`
```json
{
  "name": "Nueva tarea"
}
```
**Response:**
```json
{
  "id": "uuid",
  "name": "Nueva tarea",
  "completed": false
}
```

### Compartir tablero
**POST** `/api/boards/:boardId/users`
```json
{
  "email": "otro@email.com",
  "role": "editor"
}
```
**Response:**
```json
{
  "message": "Usuario agregado al tablero"
}
```

---

## Consideraciones Finales
- El backend y frontend están desacoplados y se comunican vía API REST.
- Todas las rutas sensibles requieren autenticación.
- El sistema es escalable y fácil de mantener.
- La documentación de la API puede ampliarse según endpoints adicionales.

---

**Desarrollado por: Valentino**