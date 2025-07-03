# TodoApp - Aplicación de Gestión de Tareas

Una aplicación web completa para la gestión de tareas y proyectos con capacidades de colaboración en equipo.

## Estructura del Proyecto

```
ToDoconbackend/
├── server/                  # Backend (Node.js + Express)
│   ├── controllers/         # Controladores de rutas
│   ├── db/                  # Configuración de base de datos
│   ├── middlewares/         # Middlewares de autenticación y autorización
│   ├── routes/              # Definición de rutas
│   ├── servieces/           # Servicios de lógica de negocio
│   ├── index.js             # Archivo principal del servidor
│   └── package.json
└── frontend/                # Frontend (React + Vite)
    ├── src/
    │   ├── components/      # Componentes reutilizables
    │   ├── contexts/        # Contextos de React
    │   ├── hooks/           # Hooks personalizados
    │   ├── lib/             # Utilidades
    │   ├── pages/           # Componentes de páginas
    │   ├── services/        # Servicios de API
    │   └── App.jsx
    ├── package.json
    └── tailwind.config.js
```

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Manejo de políticas de origen cruzado

### Frontend
- **React 18** - Biblioteca de JavaScript para UI
- **Vite** - Herramienta de desarrollo y construcción
- **Tailwind CSS** - Framework de CSS utilitario
- **React Router** - Enrutamiento para React
- **TanStack Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP
- **Headless UI** - Componentes de UI accesibles
- **Heroicons** - Iconos SVG

## Características Principales

- 🔐 **Sistema de Autenticación**
  - Registro e inicio de sesión
  - Tokens JWT para seguridad
  - Persistencia de sesión

- 📋 **Gestión de Tableros**
  - Crear, editar y eliminar tableros
  - Organización por proyectos
  - Vista de dashboard personalizada

- ✅ **Gestión de Tareas**
  - CRUD completo de tareas
  - Estados: pendiente/completada
  - Fechas de vencimiento
  - Descripciones detalladas

- 👥 **Colaboración en Equipo**
  - Sistema de permisos (propietario, editor, lector)
  - Compartir tableros con otros usuarios
  - Control granular de accesos

- 🎨 **Interfaz Moderna**
  - Diseño responsivo
  - UI intuitiva y limpia
  - Feedback visual en tiempo real

## Instalación y Configuración

### Prerrequisitos
- Node.js (v20 o superior)
- PostgreSQL
- npm o yarn

### Backend

1. **Navegar al directorio del servidor:**
   ```bash
   cd server
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar base de datos:**
   - Crear base de datos PostgreSQL
   - Configurar variables de entorno en `.env`
   - Ejecutar migraciones si existen

4. **Iniciar servidor:**
   ```bash
   npm start
   ```
   El backend estará disponible en `http://localhost:3000`

### Frontend

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`

## API Endpoints

### Autenticación
- `POST /api/auth/registrarse` - Registro de usuario
- `POST /api/auth/logearse` - Inicio de sesión

### Tableros
- `GET /api/tableros` - Listar tableros del usuario
- `GET /api/tableros/:id` - Obtener tablero específico
- `POST /api/tableros` - Crear nuevo tablero
- `PUT /api/tableros/:id` - Actualizar tablero
- `DELETE /api/tableros/:id` - Eliminar tablero

### Tareas
- `GET /api/tableros/:id/tareas` - Listar tareas del tablero
- `GET /api/tableros/:id/tareas/:taskId` - Obtener tarea específica
- `POST /api/tableros/:id/tareas` - Crear nueva tarea
- `PUT /api/tableros/:id/tareas/:taskId` - Actualizar tarea
- `DELETE /api/tableros/:id/tareas/:taskId` - Eliminar tarea
- `DELETE /api/tableros/:id/tareas/completadas` - Eliminar tareas completadas

### Permisos y Colaboración
- `GET /api/tableros/:id/permisos` - Listar permisos del tablero
- `POST /api/tableros/:id/compartir` - Compartir tablero
- `PUT /api/tableros/:id/usuarios/:uid/rol` - Cambiar rol de usuario
- `DELETE /api/tableros/:id/usuarios/:uid` - Revocar acceso

### Usuarios
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario específico
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

## Flujo de la Aplicación

1. **Landing Page** - Página de bienvenida con información del producto
2. **Registro/Login** - Autenticación de usuarios
3. **Dashboard** - Vista principal con lista de tableros
4. **Tablero** - Vista detallada con tareas organizadas
5. **Gestión** - CRUD de tableros y tareas
6. **Colaboración** - Compartir y gestionar permisos

## Roles y Permisos

- **Propietario**
  - Control total del tablero
  - Puede eliminar el tablero
  - Gestiona permisos de otros usuarios
  - CRUD completo de tareas

- **Editor**
  - Puede crear, editar y eliminar tareas
  - No puede eliminar el tablero
  - No puede gestionar permisos

- **Lector**
  - Solo puede visualizar tareas
  - Sin permisos de edición

## Desarrollo

### Comandos Útiles

**Backend:**
```bash
npm start          # Iniciar servidor
npm run dev        # Servidor con nodemon (desarrollo)
npm test           # Ejecutar tests
```

**Frontend:**
```bash
npm run dev        # Servidor de desarrollo
npm run build      # Construir para producción
npm run preview    # Vista previa de producción
npm run lint       # Ejecutar linter
```

### Estructura de Base de Datos

- **usuarios** - Información de usuarios registrados
- **tableros** - Tableros de tareas
- **tareas** - Tareas individuales
- **permisos** - Relación usuarios-tableros con roles

## Próximas Mejoras

- [ ] Notificaciones en tiempo real
- [ ] Comentarios en tareas
- [ ] Archivos adjuntos
- [ ] Filtros y búsqueda avanzada
- [ ] Estadísticas y reportes
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] API REST documentada con Swagger

## Contribuir

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit los cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Soporte

Para reportar bugs o solicitar nuevas características, por favor crea un issue en el repositorio de GitHub.
