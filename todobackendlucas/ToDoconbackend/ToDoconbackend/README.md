# TareasHub - Frontend + Backend

Una aplicación completa de gestión de tareas con React, Vite y Node.js con Express.

## Estructura del Proyecto

```
├── frontendToDo/     # Aplicación React con Vite
└── server/           # API Backend con Express
```

## Configuración

### 1. Backend (Server)

#### Prerrequisitos
- Node.js 18+
- PostgreSQL
- npm o yarn

#### Instalación
```bash
cd server
npm install
```

#### Configuración de Variables de Entorno
Crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Configura las variables en `.env`:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Configuración de PostgreSQL
- `JWT_SECRET`: Clave secreta para JWT (usa una clave fuerte en producción)
- `PORT`: Puerto del servidor (por defecto 3000)

#### Base de Datos
Asegúrate de tener PostgreSQL corriendo y las tablas creadas según el esquema de tu base de datos.

#### Ejecución
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

### 2. Frontend

#### Instalación
```bash
cd frontendToDo
npm install
```

#### Ejecución
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build
```

## Funcionalidades

### Autenticación
- ✅ Registro de usuarios
- ✅ Login/Logout
- ✅ Protección de rutas con JWT
- ✅ Persistencia de sesión

### Gestión de Tableros
- ✅ Crear tableros
- ✅ Listar tableros del usuario
- ✅ Eliminar tableros (solo propietario)
- ✅ Compartir tableros con otros usuarios
- ✅ Roles de permisos (propietario, editor, lector)

### Gestión de Tareas
- ✅ Crear tareas en tableros
- ✅ Listar tareas por tablero
- ✅ Marcar tareas como completadas
- ✅ Editar tareas
- ✅ Eliminar tareas
- ✅ Filtrar tareas (todas, completadas, pendientes)

### Configuración
- ✅ Configuraciones de interfaz
- ✅ Persistencia de preferencias

## API Endpoints

### Autenticación
- `POST /api/auth/registrarse` - Registro
- `POST /api/auth/logearse` - Login

### Tableros
- `GET /api/tableros` - Listar tableros
- `POST /api/tableros` - Crear tablero
- `GET /api/tableros/:id` - Obtener tablero
- `PUT /api/tableros/:id` - Actualizar tablero
- `DELETE /api/tableros/:id` - Eliminar tablero

### Permisos
- `GET /api/tableros/:id/permisos` - Listar permisos
- `POST /api/tableros/:id/compartir` - Compartir tablero
- `PUT /api/tableros/:id/usuarios/:uid/rol` - Cambiar rol
- `DELETE /api/tableros/:id/usuarios/:uid` - Revocar acceso

### Tareas
- `GET /api/tableros/:tablero_id/tareas` - Listar tareas
- `POST /api/tableros/:tablero_id/tareas` - Crear tarea
- `GET /api/tableros/:tablero_id/tareas/:id` - Obtener tarea
- `PUT /api/tableros/:tablero_id/tareas/:id` - Actualizar tarea
- `DELETE /api/tableros/:tablero_id/tareas/:id` - Eliminar tarea
- `DELETE /api/tableros/:tablero_id/tareas/completadas` - Eliminar completadas

## Tecnologías

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- React Query (TanStack Query)
- Zustand (Estado global)
- React Router
- Axios
- React Hot Toast

### Backend
- Node.js
- Express
- PostgreSQL
- JWT para autenticación
- bcrypt para hash de contraseñas
- CORS
- dotenv

## Desarrollo

### Estructura del Frontend
```
src/
├── components/        # Componentes React
├── pages/            # Páginas principales
├── services/         # API calls
├── stores/           # Estado global (Zustand)
├── hooks/            # Custom hooks
└── api.ts           # Configuración de Axios
```

### Estructura del Backend
```
server/
├── controllers/      # Lógica de controladores
├── routes/          # Definición de rutas
├── services/        # Lógica de negocio
├── middlewares/     # Middlewares personalizados
├── db/             # Configuración de base de datos
└── index.js        # Punto de entrada
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
