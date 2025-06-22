# 📋 To-Do App - Gestión Inteligente de Tareas

Una aplicación moderna y completa de gestión de tareas construida con **React**, **Node.js** y **PostgreSQL**. Permite crear múltiples tableros organizacionales, gestionar tareas colaborativas y administrar usuarios con un panel de control avanzado.

![To-Do App](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.0-blue?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Características Principales

### 🎯 Gestión de Tareas
- **Múltiples tableros** organizados por categorías (Personal/Universidad)
- **Tareas colaborativas** con asignación de usuarios
- **Prioridades** y fechas de vencimiento
- **Marcado de completadas** con persistencia
- **Edición en tiempo real** de tareas

### 👥 Colaboración
- **Compartir tableros** con otros usuarios
- **Roles de acceso** (Propietario, Editor, Visualizador)
- **Enlaces públicos** para compartir sin registro
- **Gestión de permisos** granular

### 🛠️ Panel Administrativo
- **Dashboard exclusivo** para administradores
- **Estadísticas en tiempo real** (usuarios, tableros, tareas)
- **Gestión completa de usuarios** con eliminación segura
- **Monitoreo del sistema** con métricas detalladas

### 🎨 Experiencia de Usuario
- **Interfaz moderna** con efectos de cristal y animaciones
- **Diseño responsive** para todos los dispositivos
- **Tema oscuro** con gradientes púrpura/azul
- **Notificaciones** en tiempo real
- **Navegación intuitiva** con React Router

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de estilos utilitarios
- **React Router** - Enrutamiento de aplicaciones
- **React Context** - Gestión de estado global
- **Lucide React** - Iconografía moderna

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **PostgreSQL** - Base de datos relacional
- **bcrypt** - Encriptación de contraseñas
- **JWT** - Autenticación con tokens
- **CORS** - Compartir recursos entre orígenes

## 📦 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 18 o superior)
- **PostgreSQL** (versión 15 o superior)
- **npm** o **yarn**

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO/To-Do-Vite
```

### 2. Instalar dependencias
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Configurar base de datos
```bash
# Crear base de datos
createdb todo_app

# Ejecutar migraciones (opcional)
psql -d todo_app -f database/schema.sql
```

### 4. Configurar variables de entorno
Crear archivo `.env` en `backend/`:
```env
DB_USER=tu_usuario_postgres
DB_HOST=localhost
DB_NAME=todo_app
DB_PASSWORD=tu_contraseña_postgres
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_super_segura
```

### 5. Ejecutar la aplicación
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

### 6. Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 🎮 Guía de Uso

### 👤 Registro e Inicio de Sesión
1. Accede a la aplicación
2. Regístrate con un nuevo usuario o inicia sesión
3. El usuario `luca` tiene acceso administrativo

### 📋 Crear y Gestionar Tableros
1. **Crear tablero**: Haz clic en "Crear Tablero"
2. **Asignar categoría**: Personal o Universidad
3. **Compartir**: Invita usuarios con roles específicos
4. **Gestionar**: Edita, elimina o archiva tableros

### ✅ Gestionar Tareas
- **Agregar**: Escribe y presiona Enter
- **Editar**: Haz clic en el ícono de edición
- **Completar**: Marca el círculo junto a la tarea
- **Eliminar**: Usa el ícono de papelera
- **Priorizar**: Asigna prioridades y fechas

### 🛠️ Panel Administrativo
1. Inicia sesión como `luca`
2. Accede al "Dashboard Administrativo"
3. Visualiza estadísticas del sistema
4. Gestiona usuarios y sus datos

## 🏗️ Estructura del Proyecto

```
To-Do-Vite/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── PageLayout.jsx   # Layout principal
│   │   ├── AnimatedBackground.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/               # Páginas de la aplicación
│   │   ├── Home.jsx         # Página principal
│   │   ├── Boards.jsx       # Gestión de tableros
│   │   ├── BoardDetail.jsx  # Detalle de tablero
│   │   ├── AdminDashboard.jsx # Panel administrativo
│   │   └── Auth.jsx         # Autenticación
│   ├── context/             # Contextos de React
│   ├── config/              # Configuraciones
│   └── stores/              # Estado global
├── backend/
│   ├── routes/              # Rutas de la API
│   │   ├── auth.js          # Autenticación
│   │   ├── boardRoutes.js   # Gestión de tableros
│   │   ├── taskRoutes.js    # Gestión de tareas
│   │   └── admin.js         # Panel administrativo
│   ├── middleware/          # Middlewares
│   ├── services/            # Lógica de negocio
│   ├── config/              # Configuración de BD
│   └── server.js            # Servidor principal
└── database/
    └── schema.sql           # Estructura de BD
```

## 🔧 Configuración Avanzada

### Variables de Entorno
```env
# Base de datos
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todo_app
DB_PASSWORD=tu_contraseña
DB_PORT=5432

# JWT
JWT_SECRET=clave_super_secreta

# Servidor
PORT=3000
NODE_ENV=development
```

### Scripts Disponibles
```bash
# Desarrollo
npm run dev          # Frontend en modo desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build

# Backend
npm start            # Iniciar servidor
npm run dev          # Servidor con nodemon
```

## 🐛 Solución de Problemas

### Error de conexión a base de datos
```bash
# Verificar PostgreSQL
sudo service postgresql status

# Verificar conexión
psql -U postgres -d todo_app
```

### Error de puertos ocupados
```bash
# Verificar puertos
lsof -i :3000
lsof -i :5173

# Matar procesos
kill -9 PID
```

### Error de dependencias
```bash
# Limpiar cache
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Luca Colazo**
- GitHub: [@tu_usuario](https://github.com/tu_usuario)
- LinkedIn: [tu_perfil](https://linkedin.com/in/tu_perfil)

## 🙏 Agradecimientos

- **React Team** por el increíble framework
- **Vite** por la herramienta de construcción
- **Tailwind CSS** por el sistema de diseño
- **PostgreSQL** por la base de datos robusta

---

⭐ **¡Si te gusta este proyecto, dale una estrella en GitHub!**
