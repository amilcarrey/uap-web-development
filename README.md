# Sistema de Gestión de Tareas

Una aplicación full-stack moderna para gestionar tareas con tableros colaborativos, desarrollada con React + TypeScript en el frontend y Node.js + Express en el backend.

## Características

### Funcionalidades Principales
- **Autenticación de usuarios** con JWT y cookies seguras
- **Tableros colaborativos** con sistema de permisos (propietario, editor, lector)
- **Gestión completa de tareas** (crear, editar, completar, eliminar)
- **Filtros y búsqueda** de tareas en tiempo real
- **Paginación** de resultados
- **Notificaciones** con sistema de toasts
- **Configuraciones personalizables** (intervalo de actualización, tareas por página)
- **Responsive design** con Tailwind CSS

### Sistema de Permisos
- **Propietario**: Control total del tablero
- **Editor**: Puede crear, editar y eliminar tareas
- **Lector**: Solo puede ver las tareas

## Tecnologías

### Frontend
- **React 18** con TypeScript
- **TanStack Router** para routing
- **TanStack Query** para gestión de estado del servidor
- **Zustand** para estado global del cliente
- **Tailwind CSS** para estilos
- **Vite** como bundler

### Backend
- **Node.js** con Express
- **TypeScript** para tipado estático
- **SQLite** como base de datos
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **cookie-parser** para manejo de cookies

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Configuración del Backend

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/uap-web-development.git
cd uap-web-development/BackendToDo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del backend
PORT=3001
JWT_SECRET=tu_secreto_jwt_super_seguro
NODE_ENV=development
```

4. **Iniciar el servidor**
```bash
npm run dev
```

El backend estará disponible en `http://localhost:3001`

### Configuración del Frontend

1. **Navegar al directorio del frontend**
```bash
cd ../FrontendToDo
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar la aplicación**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Documentación de la API

### Autenticación

#### POST `/api/usuarios/register`
Registrar un nuevo usuario.

**Request:**
```json
{
  "nombre": "Franco Uribe",
  "email": "franco@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "mensaje": "Usuario registrado exitosamente",
  "usuario": {
    "id": "usr-123",
    "nombre": "Franco Uribe",
    "email": "franco@example.com"
  }
}
```

#### POST `/api/usuarios/login`
Iniciar sesión.

**Request:**
```json
{
  "email": "franco@example.com",
  "password": "123456"
}
```

### Tableros

#### GET `/api/tableros`
Obtener todos los tableros del usuario.

**Response:**
```json
{
  "tableros": [
    {
      "id": "tb-123",
      "alias": "personal",
      "nombre": "Tareas Personales",
      "rol": "propietario"
    }
  ]
}
```

#### POST `/api/tableros`
Crear un nuevo tablero.

**Request:**
```json
{
  "nombre": "Proyecto Web",
  "alias": "proyecto-web"
}
```

#### DELETE `/api/tableros/:alias`
Eliminar un tablero (solo propietario).

### Tareas

#### GET `/api/tareas`
Obtener tareas de un tablero con paginación y filtros.

**Query Parameters:**
- `idTablero`: ID del tablero
- `filtro`: `todas` | `completadas` | `pendientes`
- `pagina`: Número de página (default: 1)
- `limite`: Tareas por página (default: 5)

**Response:**
```json
{
  "tareas": [
    {
      "id": 1,
      "descripcion": "Completar documentación",
      "completada": false,
      "fechaCreacion": "2025-01-26T10:00:00Z",
      "idTablero": "tb-123"
    }
  ],
  "totalTareas": 15,
  "totalPaginas": 3,
  "paginaActual": 1
}
```

#### POST `/api/tareas`
Crear una nueva tarea.

**Request:**
```json
{
  "descripcion": "Nueva tarea importante",
  "idTablero": "tb-123"
}
```

#### PUT `/api/tareas/:id`
Actualizar descripción de una tarea.

**Request:**
```json
{
  "descripcion": "Descripción actualizada"
}
```

#### PUT `/api/tareas/:id/toggle`
Cambiar estado de completado de una tarea.

#### DELETE `/api/tareas/:id`
Eliminar una tarea específica.

#### DELETE `/api/tareas/completadas`
Eliminar todas las tareas completadas de un tablero.

**Query Parameters:**
- `idTablero`: ID del tablero

#### GET `/api/tareas/buscar`
Buscar tareas por texto.

**Query Parameters:**
- `query`: Texto a buscar

### Configuraciones

#### GET `/api/configuraciones`
Obtener configuraciones actuales.

#### PUT `/api/configuraciones`
Actualizar configuraciones.

**Request:**
```json
{
  "intervaloRefetch": 5,
  "tareasPorPagina": 10,
  "descripcionMayusculas": true
}
```

## Estructura del Proyecto

```
uap-web-development/
├── BackendToDo/
│   ├── src/
│   │   ├── controllers/       # Controladores de la API
│   │   ├── middleware/        # Middlewares de autenticación y permisos
│   │   ├── models/           # Tipos y modelos de datos
│   │   ├── routes/           # Definición de rutas
│   │   ├── services/         # Lógica de negocio
│   │   ├── db/              # Configuración de base de datos
│   │   └── server.ts        # Servidor principal
│   ├── database.sqlite      # Base de datos SQLite
│   └── package.json
└── FrontendToDo/
    ├── src/
    │   ├── components/       # Componentes React
    │   ├── hooks/           # Custom hooks
    │   ├── store/           # Estado global (Zustand)
    │   ├── types/           # Tipos TypeScript
    │   ├── assets/          # Recursos estáticos
    │   ├── router.tsx       # Configuración de rutas
    │   └── App.tsx          # Componente principal
    └── package.json
```

## Seguridad

- **Autenticación JWT** con cookies httpOnly
- **Middleware de autorización** por roles
- **Validación de permisos** en cada endpoint
- **Sanitización de datos** de entrada
- **CORS configurado** para dominios específicos

## Estados de Respuesta

- **200**: Operación exitosa
- **201**: Recurso creado exitosamente
- **400**: Solicitud incorrecta
- **401**: No autenticado
- **403**: Sin permisos suficientes
- **404**: Recurso no encontrado
- **500**: Error interno del servidor

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Autor

**Franco Uribe** -