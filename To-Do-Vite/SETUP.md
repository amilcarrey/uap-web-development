# Guía de Configuración - To-Do App

## Requisitos Previos

### Software Necesario
- **Node.js** 16.0.0 o superior
- **npm** 8.0.0 o superior (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

### Verificar Instalación
```bash
node --version    # Debe ser >= 16.0.0
npm --version     # Debe ser >= 8.0.0
```

## Instalación Paso a Paso

### 1. Clonar o Descargar el Proyecto

#### Opción A: Clonar con Git
```bash
git clone <https://github.com/Lucavcolazo/progra3.git>
cd To-Do-Vite
```

#### Opción B: Descargar ZIP
1. Descargar el archivo ZIP del repositorio
2. Extraer en una carpeta
3. Abrir terminal en la carpeta extraída

### 2. Instalar Dependencias del Frontend
```bash
# Desde la raíz del proyecto
npm install
```

### 3. Instalar Dependencias del Backend
```bash
cd backend
npm install
cd ..
```

### 4. Configurar Base de Datos

El proyecto usa **SQLite** que se configura automáticamente. La base de datos se creará en `backend/database.sqlite` al ejecutar el servidor por primera vez.

### 5. Ejecutar Datos de Prueba (Opcional)
```bash
cd backend
npm run seed
cd ..
```

Esto creará usuarios de prueba y datos de ejemplo.

## Ejecutar la Aplicación

### Opción A: Ejecutar en Modo Desarrollo

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
**Resultado esperado:**
```
Servidor corriendo en http://localhost:3000
```

#### Terminal 2 - Frontend
```bash
# Desde la raíz del proyecto
npm run dev
```
**Resultado esperado:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Opción B: Ejecutar en Producción

#### Build del Frontend
```bash
npm run build
```

#### Servir Archivos Estáticos
```bash
npm run preview
```

## Acceder a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Datos de Prueba

### Usuarios Predefinidos
| Usuario | Contraseña | Rol |
|---------|------------|-----|
| `luca` | `admin123` | Administrador |
| `maria` | `password123` | Usuario |
| `juan` | `password123` | Usuario |
| `ana` | `password123` | Usuario |

### Crear Nuevo Usuario
1. Ir a http://localhost:5173
2. Hacer clic en "¿No tienes cuenta? Regístrate"
3. Completar formulario de registro
4. Iniciar sesión con las nuevas credenciales

## Configuración Avanzada

### Variables de Entorno (Opcional)

Crear archivo `.env` en la carpeta `backend/`:
```env
# Configuración de la base de datos (SQLite por defecto)
DB_PATH=./database.sqlite

# Configuración JWT
JWT_SECRET=tu_clave_secreta_super_segura

# Configuración del servidor
PORT=3000
NODE_ENV=development

# Configuración CORS
CORS_ORIGIN=http://localhost:5173
```

### Configuración de Base de Datos Personalizada

Si quieres usar otra base de datos, modificar `backend/config/db.js`:
```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

module.exports = db;
```

## Comandos Útiles

### Desarrollo
```bash
# Instalar dependencias
npm install
cd backend && npm install

# Ejecutar en desarrollo
npm run dev                    # Frontend
cd backend && npm run dev      # Backend

# Ejecutar tests (si están configurados)
npm test

# Linting
npm run lint
```

### Base de Datos
```bash
# Regenerar datos de prueba
cd backend && npm run seed

# Ver estructura de la base de datos
sqlite3 backend/database.sqlite ".schema"

# Ejecutar consultas SQL
sqlite3 backend/database.sqlite "SELECT * FROM users;"
```

### Build y Producción
```bash
# Build del frontend
npm run build

# Preview del build
npm run preview

# Ejecutar en producción
cd backend && npm start
```

## Solución de Problemas

### Error: "Port already in use"
```bash
# Encontrar proceso usando el puerto
lsof -i :3000
lsof -i :5173

# Matar proceso
kill -9 <PID>
```

### Error: "Module not found"
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Database locked"
```bash
# Verificar si hay múltiples instancias corriendo
ps aux | grep node

# Reiniciar el servidor
cd backend && npm run dev
```

### Error: "CORS policy"
Verificar que el backend esté corriendo en el puerto correcto y que la configuración CORS en `backend/server.js` sea correcta.

### Error: "JWT token invalid"
```bash
# Limpiar cookies del navegador
# O usar modo incógnito
# O regenerar datos de prueba
cd backend && npm run seed
```

## Configuración para Diferentes Entornos

### Desarrollo Local
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Base de datos: SQLite local

### Producción
- Configurar variables de entorno
- Usar base de datos PostgreSQL o MySQL
- Configurar HTTPS
- Configurar dominio personalizado

### Docker (Futuro)
```dockerfile
# Dockerfile para el backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Verificación de Instalación

### Checklist de Verificación
- [ ] Node.js instalado y funcionando
- [ ] Dependencias instaladas (frontend y backend)
- [ ] Servidor backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Base de datos SQLite creada
- [ ] Datos de prueba cargados (opcional)
- [ ] Login funcionando con usuario de prueba
- [ ] Creación de tableros funcionando
- [ ] Creación de tareas funcionando

### Comandos de Verificación
```bash
# Verificar puertos
curl -I http://localhost:3000/boards
curl -I http://localhost:5173

# Verificar base de datos
sqlite3 backend/database.sqlite "SELECT COUNT(*) FROM users;"

# Verificar logs del servidor
# Revisar consola del backend para errores
```

## Soporte

Si encuentras problemas durante la instalación:

1. **Verificar requisitos previos**
2. **Revisar logs de error**
3. **Consultar la sección de solución de problemas**
4. **Verificar que no haya conflictos de puertos**
5. **Reinstalar dependencias si es necesario**

---

**La aplicación debería estar funcionando correctamente.** 