# API de Gestión de Tareas - Documentación

Este backend ofrece una API RESTful para gestionar usuarios, tableros colaborativos, tareas y configuraciones personalizadas, con autenticación y autorización granular.  
Desarrollado en Express.js + TypeScript + Prisma + SQLite.

---

## **Base URL**
```
http://localhost:3001/api
```

---

## **Autenticación de Usuario**

### **Registro**
**Endpoint:**
```http
POST /auth/register
```
**Body:**
```json
{
  "username": "ejemplo",
  "password": "secreta"
}
```
**Respuestas:**
- `201`:  
  ```json
  { "message": "Usuario creado correctamente" }
  ```
- `400`:  
  ```json
  { "error": "El usuario ya existe" }
  ```

---

### **Login**
**Endpoint:**
```http
POST /auth/login
```
**Body:**
```json
{
  "username": "ejemplo",
  "password": "secreta"
}
```
**Respuesta:**
```json
{ "message": "Login exitoso" }
```
> Guarda JWT en cookie httpOnly.

---

### **Logout**
**Endpoint:**
```http
POST /auth/logout
```
**Respuesta:**
```json
{ "message": "Sesión cerrada" }
```

---

## **Tableros (Boards)**

### Crear tablero
```http
POST /boards
```
**Body:**
```json
{ "name": "Mi Tablero" }
```
**Respuesta:**
- `201`: Datos del tablero creado

---

### Listar mis tableros
```http
GET /boards
```
**Respuesta:**
```json
[ ...tableros ]
```

---

### Compartir tablero
```http
POST /boards/share
```
**Body:**
```json
{ "boardId": "abc123", "targetUsername": "usuario", "role": "editor" }
```
**Respuesta:**
```json
{ "message": "Permiso actualizado" }
```

---

### Listar permisos de un tablero
```http
GET /boards/:id/permissions
```
**Respuesta:**
```json
[ ...permisos ]
```

---

### Cambiar rol de un usuario
```http
POST /boards/:id/permissions
```
**Body:**
```json
{ "targetUserId": "abc123", "role": "viewer" }
```

---

### Eliminar usuario de un tablero
```http
DELETE /boards/:id/permissions/:targetUserId
```
**Body:**
```json
{ "message": "Permiso eliminado" }
```
---

## **Tareas (Tasks)**

### Listar tareas de un tablero
```http
GET /tareas?filter=all|active|completed&search=texto&page=1&limit=5&mode=nombreTablero
```
**Respuesta:**
```json
{
  "tasks": [ ... ],
  "total": 10,
  "totalPages": 2,
  "currentPage": 1
}
```

---

### Agregar tarea
```http
POST /tareas/nuevo
```
**Body:**
```json
{ "action": "add", "task": "Nueva tarea", "mode": "personal" }
```

---

### Completar/Descompletar tarea
```http
POST /tareas/:id
```
**Body:**
```json
{ "action": "toggle", "id": "idTarea", "mode": "personal" }
```

---

### Editar tarea
```http
POST /tareas/:id
```
**Body:**
```json
{ "action": "edit", "id": "idTarea", "task": "Nuevo texto", "mode": "personal" }
```

---

### Eliminar tarea
```http
POST /tareas/:id
```
**Body:**
```json
{ "action": "delete", "id": "idTarea", "mode": "personal" }
```

---

### Eliminar tareas completadas en lote
```http
POST /tareas/nuevo
```
**Body:**
```json
{ "action": "clear-completed", "mode": "personal" }
```

---

## **Configuraciones de usuario**

### Ver configuración
```http
GET /user/config
```
**Respuesta:**
```json
{
  "id": "configId",
  "userId": "userId",
  "allTasksUppercase": false,
  "theme": "light",
  "autoRefreshInterval": 60
}
```

---

### Actualizar configuración
```http
PUT /user/config
```
**Body:**
```json
{
  "allTasksUppercase": true,
  "theme": "dark",
  "autoRefreshInterval": 90
}
```

---

## **Notas de Seguridad**
- Todos los endpoints salvo `/auth/` requieren usuario autenticado (JWT en cookie httpOnly).
- Solo los dueños de tableros pueden modificar permisos.
- Los roles (`owner`, `editor`, `viewer`) determinan el nivel de acceso sobre tableros y tareas.

---

## **Cómo correr el backend localmente**

1. Instalar dependencias:
    ```bash
    npm install
    ```
2. Configurar `.env` (ya configurado por defecto para SQLite).
3. Aplicar migraciones Prisma:
    ```bash
    npx prisma migrate dev
    ```
4. Ejecutar el servidor:
    ```bash
    npm run dev
    ```

---

## **Ejemplo de flujo básico**

1. Registrar usuario
2. Login (cookie JWT)
3. Crear tablero
4. Agregar tareas al tablero
5. Compartir tablero con otro usuario
6. Cambiar tema y preferencias desde `/user/config`