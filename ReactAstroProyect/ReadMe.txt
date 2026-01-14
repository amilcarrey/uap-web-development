📋 TaskManager - Sistema de Gestión de Tareas
🎯 Descripción del Proyecto
TaskManager es una aplicación web completa para la gestión de tareas con sistema de usuarios, categorías compartidas y configuraciones personalizables. El sistema permite crear tableros colaborativos donde múltiples usuarios pueden trabajar juntos en sus tareas.

🏗️ Arquitectura del Sistema
Frontend (React + TypeScript)
Framework: React 19 con TypeScript
Routing: TanStack Router
Estado Global: Zustand con persistencia
Fetching: TanStack Query (React Query)
Estilos: Tailwind CSS + Font Awesome
Build Tool: Vite
Backend (Node.js + Express)
Framework: Express.js con TypeScript
Base de Datos: SQLite3
Autenticación: JWT con cookies httpOnly
Encriptación: Argon2 para passwords
Middleware: CORS, Cookie Parser

🚀 Configuración e Instalación
Prerrequisitos
Node.js 18+
npm o yarn
Git
1. Clonar el Repositorio
2. Configurar Backend
3. Configurar Frontend
4. Acceder a la Aplicación
Frontend: http://localhost:5173
Backend API: http://localhost:4000

🔗 Documentación de la API:

🔐 Autenticación
POST /api/auth/register
Registrar nuevo usuario
    // Request
    POST http://localhost:4000/api/auth/register
    Content-Type: application/json

    {
    "email": "usuario@email.com",
    "password": "password123",
    "role": "user"
    }

    // Response 201 - Éxito
    {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@email.com",
    "role": "user"
    }

    // Response 400 - Error
    {
    "error": "Usuario ya existe"
    }

POST /api/auth/login
Iniciar sesión
    // Request
    POST http://localhost:4000/api/auth/login
    Content-Type: application/json

    {
    "email": "usuario@email.com",
    "password": "password123"
    }

    // Response 200 - Éxito
    {
    "message": "Inicio de sesión exitoso"
    }
    // + Cookie: token=eyJhbGciOiJIUzI1NiIs... (httpOnly)

    // Response 401 - Error
    {
    "error": "Contraseña incorrecta"
    }

POST /api/auth/logout
Cerrar sesión
    // Request
    POST http://localhost:4000/api/auth/logout
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "message": "Logout exitoso"
    }

GET /api/auth/me
Obtener usuario actual (requiere autenticación)
    // Request (requiere cookie de autenticación)
    GET http://localhost:4000/api/auth/me
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200 - Éxito
    {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@email.com",
    "role": "user"
    }

📁 Gestión de Categorías/Tableros
GET /api/categorias
Obtener categorías del usuario
// Request
    GET http://localhost:4000/api/categorias
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    [
    {
        "id": "trabajo",
        "name": "Trabajo",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "userRole": "owner",
        "isShared": false
    },
    {
        "id": "personal",
        "name": "Personal",
        "userId": null,
        "userRole": "editor",
        "isShared": true
    }
    ]

POST /api/categorias
Crear nueva categoría
  // Request
    POST http://localhost:4000/api/categorias
    Content-Type: application/json
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    {
    "id": "mi-proyecto",
    "name": "Mi Proyecto"
    }

    // Response 201
    {
    "message": "Categoría agregada exitosamente"
    }

    // Response 400 - Error
    {
    "error": "La categoría ya existe"
    }  

DELETE /api/categorias/:id
Eliminar categoría (solo owners)
    // Request
    DELETE http://localhost:4000/api/categorias/trabajo
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "message": "Categoría eliminada exitosamente"
    }

    // Response 403 - Sin permisos
    {
    "error": "Solo el propietario puede eliminar esta categoría."
    }


POST /api/categorias/:id/share
Compartir categoría con otro usuario
    // Request
    POST http://localhost:4000/api/categorias/trabajo/share
    Content-Type: application/json
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    {
    "userEmail": "colaborador@email.com",
    "role": "editor"
    }

    // Response 200
    {
    "message": "Categoría compartida exitosamente"
    }

    // Response 400 - Error
    {
    "error": "Usuario no encontrado con ese email."
    }

GET /api/categorias/:id/permissions
Ver permisos de una categoría
    // Request
    GET http://localhost:4000/api/categorias/trabajo/permissions
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    [
    {
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "email": "owner@email.com",
        "role": "owner"
    },
    {
        "userId": "660e8400-e29b-41d4-a716-446655440001",
        "email": "colaborador@email.com", 
        "role": "editor"
    }
    ]

✅ Gestión de Tareas
GET /api/tasks
Obtener tareas con paginación
    // Request con parámetros
    GET http://localhost:4000/api/tasks?filtro=pendientes&categoriaId=trabajo&page=1&pageSize=7&search=comprar
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "tasks": [
        {
        "id": 1,
        "text": "Comprar leche para el café",
        "completed": false,
        "categoriaId": "trabajo"
        },
        {
        "id": 2,
        "text": "Revisar documentación del proyecto",
        "completed": false,
        "categoriaId": "trabajo"
        }
    ],
    "totalPages": 3,
    "totalCount": 15
    }

POST /api/tasks
    Crear nueva tarea
    // Request
    POST http://localhost:4000/api/tasks
    Content-Type: application/json
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    {
    "text": "Completar documentación de la API",
    "categoriaId": "trabajo"
    }

    // Response 201
    {
    "message": "Tarea agregada exitosamente"
    }

    // Response 403 - Sin permisos
    {
    "error": "No tienes permisos para agregar tareas en esta categoría."
    }

PUT /api/tasks/:id
Editar tarea
    // Request
    PUT http://localhost:4000/api/tasks/1
    Content-Type: application/json
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    {
    "text": "Completar documentación de la API (URGENTE)",
    "categoriaId": "trabajo"
    }

    // Response 200
    {
    "message": "Tarea editada exitosamente"
    }

PATCH /api/tasks/:id/toggle
    Cambiar estado de tarea (completada/pendiente).
    // Request
    PATCH http://localhost:4000/api/tasks/1/toggle
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "message": "Estado de tarea actualizado"
    }

DELETE /api/tasks/:id
Eliminar tarea específica
    // Request
    DELETE http://localhost:4000/api/tasks/1
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "message": "Tarea eliminada exitosamente"
    }

    // Response 404 - No encontrada
    {
    "error": "Tarea no encontrada"
    }

DELETE /api/tasks/completed
Eliminar todas las tareas completadas de una categoría
    // Request
    DELETE http://localhost:4000/api/tasks/completed?categoriaId=trabajo
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "message": "Tareas completas eliminadas"
    }

⚙️ Configuraciones de Usuario
GET /api/userSettings
    Obtener configuraciones del usuario
    // Request
    GET http://localhost:4000/api/userSettings
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "uppercaseDescriptions": "false",
    "refetchInterval": "30",
    "tasksPerPage": "7"
    }

PUT /api/userSettings
Actualizar configuraciones múltiple
// Request - Actualizar múltiples configuraciones
PUT http://localhost:4000/api/userSettings
Content-Type: application/json
Cookie: token=eyJhbGciOiJIUzI1NiIs...

{
  "uppercaseDescriptions": "true",
  "refetchInterval": "60",
  "tasksPerPage": "15"
}

// Response 200
{
  "message": "Configuraciones actualizadas exitosamente"
}

PUT /api/userSettings Individual
// Request - Actualizar una configuración
PUT http://localhost:4000/api/userSettings
Content-Type: application/json
Cookie: token=eyJhbGciOiJIUzI1NiIs...

{
  "settingKey": "tasksPerPage",
  "settingValue": "10"
}

// Response 200
{
  "message": "Configuración actualizada exitosamente"
}

POST /api/userSettings
Crear nueva configuración
    // Request
    POST http://localhost:4000/api/userSettings
    Content-Type: application/json
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    {
    "settingKey": "nuevaConfiguracion",
    "settingValue": "valor"
    }

    // Response 201
    {
    "message": "Configuración agregada exitosamente"
    }

DELETE /api/userSettings/:settingKey
Eliminar configuración específica
    // Request
    DELETE http://localhost:4000/api/userSettings/uppercaseDescriptions
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "message": "Configuración eliminada exitosamente"
    }

DELETE /api/userSettings/all
Resetear todas las configuraciones a valores por defecto
    // Request
    DELETE http://localhost:4000/api/userSettings/all
    Cookie: token=eyJhbGciOiJIUzI1NiIs...

    // Response 200
    {
    "message": "Configuraciones restablecidas a valores por defecto"
    }


🎨 Características del Frontend:

🔐 Sistema de Autenticación
Login/Register con validaciones
Rutas protegidas automáticas
Redirección automática si no está autenticado
Manejo de errores centralizado

📋 Gestión de Tareas
CRUD completo: Crear, leer, actualizar y eliminar tareas
Paginación inteligente: Configurable por usuario
Filtros avanzados: Por estado (pendientes/completadas)
Búsqueda en tiempo real: Buscar por texto
Auto-refresh: Actualización automática configurable

👥 Sistema Colaborativo
Tableros compartidos: Múltiples usuarios por categoría
Roles granulares: Owner, Editor, Viewer
Permisos visuales: Indicadores de rol y acceso
Compartir fácil: Por email del usuario

⚙️ Configuraciones Personalizables
Tareas por página: 5, 7, 10, 15, 20
Auto-refresh: 5-300 segundos
Formato de texto: Normal o MAYÚSCULAS
Persistencia: LocalStorage + Backend

🎯 UX/UI Profesional
Responsive design: Funciona en móvil y desktop
Loading states: Indicadores de carga
Error handling: Mensajes descriptivos
Iconografía consistente: Font Awesome
Feedback visual: Notificaciones toast

🗃️ Estructura de Base de Datos
Tabla: users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user'
);
Tabla: categories
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  userId TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id)
);
Tabla: category_permissions
CREATE TABLE category_permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  categoryId TEXT NOT NULL,
  userId TEXT NOT NULL,
  role TEXT NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES categories (id),
  FOREIGN KEY (userId) REFERENCES users (id)
);
Tabla: tasks
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  categoriaId TEXT NOT NULL,
  userId TEXT NOT NULL,
  FOREIGN KEY (categoriaId) REFERENCES categories (id),
  FOREIGN KEY (userId) REFERENCES users (id)
);
Tabla: user_settings
CREATE TABLE user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId TEXT NOT NULL,
  settingKey TEXT NOT NULL,
  settingValue TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id),
  UNIQUE(userId, settingKey)
);

🔒 Seguridad Implementada:
Autenticación & Autorización:
    JWT Tokens: Almacenados en cookies httpOnly
    Password Hashing: Argon2 (más seguro que bcrypt)
    Role-based Access: Admin/User con permisos granulares
    Route Protection: Middleware de autenticación en todas las rutas protegidas
Validaciones:
    Input Sanitization: Validación en frontend y backend
    SQL Injection Prevention: Uso de prepared statements
    XSS Protection: httpOnly cookies y sanitización
    CORS Configuration: Orígenes específicos permitidos

🛠️ Tecnologías Utilizadas
Frontend Stack
    {
        "react": "^19.1.0",
        "@tanstack/react-query": "^5.76.2",
        "@tanstack/react-router": "^1.0.0",
        "zustand": "^5.0.5",
        "tailwindcss": "^4.1.6",
        "@fortawesome/fontawesome-free": "^6.7.2",
        "typescript": "^5.6.3",
        "vite": "^6.0.5"
    }
Backend Stack
    {
    "express": "^5.1.0",
    "sqlite3": "^5.1.7",
    "jsonwebtoken": "^9.0.2",
    "argon2": "^0.43.0",
    "cors": "^2.8.5",
    "cookie-parser": "^1.4.7",
    "typescript": "^5.7.3",
    "ts-node": "^10.9.2"
    }
📝 Scripts Disponibles
    Backend
        # Desarrollo con hot reload
        npm run dev

        # Compilar TypeScript
        npm run build

        # Ejecutar en producción
        npm start

        # Instalar dependencias
        npm install
    Frontend
        # Servidor de desarrollo con hot reload
        npm run dev

        # Build para producción
        npm run build

        # Preview del build de producción
        npm run preview

        # Linting del código
        npm run lint

        # Instalar dependencias
        npm install


👨‍💻 Desarrollado por:
Este sistema fue desarrollado como proyecto educativo, implementando las mejores prácticas de desarrollo full-stack con tecnologías modernas.

Stack: React + TypeScript + Express + SQLite
Patrón: MVC con separación de responsabilidades
Arquitectura: REST API con autenticación JWT
Metodología: Desarrollo incremental con testing manual

📈 Métricas del Proyecto:
Líneas de código: ~2,500 líneas
Endpoints: 20+ rutas API
Componentes React: 15+ componentes
Hooks customizados: 10+ hooks
Tablas de BD: 5 tablas relacionales
Tiempo de desarrollo: 3 semanas