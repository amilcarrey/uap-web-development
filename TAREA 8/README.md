# ✅ TAREA 8 - Backend Avanzado con Autenticación y Autorización

Proyecto completo de gestión de tareas con **Express.js** en el backend y **React + Tailwind + Zustand** en el frontend. Soporta autenticación segura, permisos por usuario y configuración personalizada.

---

## 🧠 Funcionalidades Principales

### 🔐 Sistema de Usuarios
- Registro con almacenamiento seguro de contraseña (bcrypt)
- Login con cookies HTTP-only (JWT)
- Cierre de sesión (logout) seguro
- Persistencia de sesión entre recargas
- Middleware de protección de rutas

### 📋 Sistema de Tableros
- Crear tableros (asociados a un usuario propietario)
- Compartir tableros con otros usuarios por email
- Control de permisos por usuario: `propietario`, `editor`, `lectura`
- Solo el propietario puede eliminar o editar permisos
- Los usuarios solo ven tableros donde tienen acceso

### ✅ Gestión de Tareas
- Crear, editar, completar, eliminar tareas
- Paginación configurable
- Filtros por estado (`todas`, `completadas`, `pendientes`)
- Búsqueda por contenido
- Eliminación masiva de tareas completadas
- Control de acceso según rol en el tablero

### ⚙️ Configuración Personalizada
- Modo oscuro y otros ajustes visuales
- Intervalo de refresco automático configurable
- Número de tareas por página personalizable
- Configuración persistente por usuario (almacenada en DB)

---

## 🔗 Tecnologías Usadas

### Backend
- Express.js
- SQLite (con `better-sqlite3`)
- JWT para autenticación
- bcryptjs para hashing
- Middlewares personalizados (verificación de token y roles)

### Frontend
- React + Next.js
- Zustand (manejo de estado global)
- React Query (datos y caché)
- Tailwind CSS
- Cookies HTTP-only (manejo de sesión seguro)

---

## 🛠️ Instalación y Uso Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/tarea8-backend.git
cd tarea8-backend
```

### 2. Instalar dependencias backend y frontend

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Crear archivo `.env` en `/backend`

```env
JWT_SECRET=clave_secreta_segura
NODE_ENV=development
```

### 4. Ejecutar backend

```bash
cd backend
npx ts-node src/index.ts
```

### 5. Ejecutar frontend

```bash
cd frontend
npm run dev
```

---

## 📂 Estructura de la Base de Datos

- **usuarios**
  - id, nombre, email, password, configuracion_json
- **tableros**
  - id, nombre, propietario_id
- **tareas**
  - id, titulo, completada, tablero_id
- **permisos**
  - id, usuario_id, tablero_id, rol (`editor`, `lectura`)

---

## 📬 API REST

### Autenticación
- `POST /api/auth/registro` → Registro y login automático
- `POST /api/auth/login` → Login
- `POST /api/auth/logout` → Logout
- `GET /api/usuario/perfil` → Perfil del usuario autenticado

### Tableros
- `GET /api/tableros` → Listar tableros accesibles
- `POST /api/tableros` → Crear tablero
- `GET /api/tableros/:id` → Obtener tablero por ID
- `DELETE /api/tableros/:id` → Eliminar tablero (solo propietario)
- `POST /api/tableros/:id/compartir` → Compartir tablero
- `PATCH /api/tableros/:id/permisos` → Cambiar permiso de usuario

### Tareas
- `GET /api/tareas` → Lista de tareas por tablero, paginadas y filtradas
- `POST /api/tareas` → Crear tarea
- `PATCH /api/tareas/:id` → Editar tarea
- `DELETE /api/tareas/:id` → Eliminar tarea
- `DELETE /api/tareas/completadas/:tableroId` → Eliminar tareas completadas

---

## 🔐 Seguridad Implementada

- Cookies `HttpOnly` y `SameSite` configuradas
- Contraseñas hasheadas con bcrypt
- Validación de entradas en registro/login
- Rutas protegidas con middleware `verificarToken`
- Control de permisos a nivel de tarea y tablero
- Evita acceso no autorizado con errores `401` y `403`

---

## 🧪 Recomendaciones de Pruebas

- Registro → verifica que se cree la cookie
- Login → verifica que se acceda correctamente a los tableros
- Logout → verifica que se elimine la cookie y se redirija al login
- Acceso a tablero sin permiso → debe dar 403
- Configuración → debe mantenerse tras cerrar sesión
- Cambios de permisos → deben reflejarse en la UI

---

## 👨‍💻 Autor / Grupo

- [Tu nombre o grupo]
- [Tu email o contacto opcional]

---

## ✅ Estado del Proyecto

✔️ Entregado con todos los requisitos funcionales y técnicos  
✔️ Cumple con autenticación segura, control de acceso, integración completa  
✔️ Código modular, mantenible y bien documentado

---