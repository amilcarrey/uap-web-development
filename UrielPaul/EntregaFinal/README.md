# TaskFlow - Gestor de Tareas Colaborativo

Una aplicación web moderna para gestión de tareas y tableros colaborativos, construida con React, TypeScript, Node.js y PostgreSQL.

## 🚀 Características

- ✅ **Autenticación segura** con JWT
- 📋 **Tableros colaborativos** con roles (Owner, Editor, Viewer)
- 🌙 **Modo oscuro** con persistencia
- 📱 **Diseño responsive** con Tailwind CSS
- 🔄 **Actualización automática** configurable
- 👥 **Compartir tableros** con diferentes permisos
- 🎨 **Vista cuadrícula/lista** personalizable

## 📁 Estructura del Proyecto

```
taskflow/
├── backend/          # API REST con Express + Prisma
├── frontend/         # React + TypeScript + Tailwind
├── backend/prisma/   # Migraciones y esquemas de Prisma
└── docs/             # Documentación
```

## Tecnologías

### Backend
- **Node.js** + **Express** - API REST
- **Prisma** - ORM y migraciones
- **PostgreSQL** - Base de datos (Neon)
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Swagger** - Documentación API

### Frontend
- **React 18** + **TypeScript**
- **Tailwind CSS** - Estilos
- **React Router** - Navegación
- **Heroicons** - Iconografía
- **Vite** - Build tool

## Instalación y Configuración

### 1. Clonar y configurar
```bash
git clone https://github.com/noahludi/advanced-backend.git
cd advanced-backend

# Backend
cd backend
npm install
cp .env.example .env
# Editar .env con tus datos

# Frontend  
cd ../frontend
npm install
cp .env.example .env
# Editar .env con URL del backend
```

### 2. Base de datos
```bash
cd backend

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# (Opcional) Datos de prueba
npx prisma db seed
```

### 3. Ejecutar
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  
npm run dev
```

## 🌐 Para Deploy

### Variables requeridas:

**Backend (.env):**
```env
DATABASE_URL="postgresql://..."  # Neon connection string
JWT_SECRET="..."                 # openssl rand -base64 32
```

**Frontend (.env):**
```env
VITE_API="http://localhost:puerto"
```

### Comandos de deploy:

**Backend:**
```bash
npm run dev
```

**Frontend:**
```bash
npm run dev
```

¡Listo! 🚀

