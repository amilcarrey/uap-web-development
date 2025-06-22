# 🪟 Guía de Instalación en Windows

## 📋 Requisitos Previos

### 1. Node.js
- Descargar desde: https://nodejs.org/
- Instalar con opciones por defecto
- Verificar instalación: `node --version` y `npm --version`

### 2. PostgreSQL
- Descargar desde: https://www.postgresql.org/download/windows/
- Durante la instalación:
  - Usuario: `postgres`
  - Contraseña: `tu_contraseña_postgres` (¡Recuérdala!)
  - Puerto: `5432`
  - Instalar pgAdmin (opcional pero recomendado)

### 3. Git (opcional)
- Descargar desde: https://git-scm.com/download/win
- Instalar con opciones por defecto

## 🚀 Pasos de Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO/To-Do-Vite
```

### 2. Instalar dependencias
```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd backend
npm install
cd ..
```

### 3. Configurar la base de datos

#### Opción A: Usar pgAdmin (Recomendado)
1. Abrir **pgAdmin** desde el menú de inicio
2. Conectar al servidor local (usuario: `postgres`)
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `todo_app`
5. Click en "Save"
6. Seleccionar la base de datos `todo_app`
7. Ir a "Query Tool" (ícono de SQL)
8. Copiar y pegar el contenido de `database/schema.sql`
9. Ejecutar (F5)

#### Opción B: Usar línea de comandos
```bash
# Abrir Command Prompt como administrador
# Navegar a la carpeta de PostgreSQL (ejemplo):
cd "C:\Program Files\PostgreSQL\15\bin"

# Conectar a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE todo_app;

# Conectar a la base de datos
\c todo_app

# Ejecutar el script (copiar y pegar el contenido de database/schema.sql)
# Luego escribir: \q para salir
```

### 4. Restaurar datos (opcional)
Si tienes el archivo `todo_app_backup.sql`:
```bash
# En la carpeta bin de PostgreSQL
psql -U postgres -d todo_app -f "ruta\completa\a\todo_app_backup.sql"
```

### 5. Configurar variables de entorno
Crear archivo `.env` en la carpeta `backend/`:
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todo_app
DB_PASSWORD=tu_contraseña_postgres
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_super_segura
```

### 6. Actualizar configuración de base de datos
Editar `backend/config/db.js`:
```javascript
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'todo_app',
    password: process.env.DB_PASSWORD || 'tu_contraseña_postgres',
    port: process.env.DB_PORT || 5432,
});

module.exports = pool;
```

## 🏃‍♂️ Ejecutar la aplicación

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
npm run dev
```

## 🌐 Acceder a la aplicación
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## 🔐 Usuarios por defecto
- **Admin**: `luca` (contraseña: la que hayas configurado)
- **Otros usuarios**: Los que hayas creado en tu Mac

## 🛠️ Solución de problemas comunes

### Error: "password authentication failed"
- Verificar que la contraseña de PostgreSQL sea correcta
- Verificar que el usuario tenga permisos en la base de datos
- En pgAdmin, verificar la conexión

### Error: "connection refused"
- Verificar que PostgreSQL esté ejecutándose
- Ir a "Servicios" de Windows y buscar "postgresql"
- Si no está ejecutándose, iniciarlo manualmente

### Error: "database does not exist"
- Crear la base de datos `todo_app`
- Verificar que el nombre en la configuración sea correcto
- Usar pgAdmin para verificar que existe

### Error: "module not found"
- Ejecutar `npm install` en ambas carpetas (frontend y backend)
- Verificar que Node.js esté instalado correctamente
- Limpiar cache: `npm cache clean --force`

### Error: "port already in use"
- Abrir Command Prompt como administrador
- Ejecutar: `netstat -ano | findstr :3000`
- Matar el proceso: `taskkill /PID [número_del_proceso] /F`

## 📝 Notas importantes
- Asegúrate de que los puertos 3000 y 5173 estén libres
- Si usas un firewall, permitir las conexiones a estos puertos
- Para desarrollo, puedes usar la misma contraseña de JWT que en Mac
- pgAdmin es muy útil para gestionar la base de datos visualmente

## 🔧 Comandos útiles de Windows
```bash
# Verificar si PostgreSQL está ejecutándose
sc query postgresql

# Iniciar PostgreSQL manualmente
net start postgresql

# Detener PostgreSQL
net stop postgresql

# Verificar puertos en uso
netstat -ano | findstr :3000
netstat -ano | findstr :5173
``` 