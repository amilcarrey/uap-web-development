# 🚀 Configuración del Proyecto en Windows

## 📋 Requisitos Previos

### 1. Node.js
- Descargar desde: https://nodejs.org/
- Instalar la versión LTS (recomendado)
- Verificar instalación: `node --version` y `npm --version`

### 2. Git
- Descargar desde: https://git-scm.com/download/win
- Instalar con opciones por defecto
- Verificar instalación: `git --version`

### 3. Editor de código
- **VS Code** (recomendado): https://code.visualstudio.com/
- Instalar extensiones útiles:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Auto Rename Tag
  - Bracket Pair Colorizer

## 🛠️ Configuración del Proyecto

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd progra3/To-Do-Vite
```

### 2. Instalar dependencias del frontend
```bash
npm install
```

### 3. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 4. Configurar base de datos SQLite
La base de datos SQLite se creará automáticamente al iniciar el servidor. No se requiere configuración adicional.

### 5. Variables de entorno (opcional)
Crear archivo `.env` en la carpeta `backend`:
```env
NODE_ENV=development
PORT=3000
JWT_SECRET=tu_clave_secreta_super_segura
```

## 🚀 Ejecutar el proyecto

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```
El servidor estará disponible en: http://localhost:3000

### Terminal 2 - Frontend
```bash
npm run dev
```
La aplicación estará disponible en: http://localhost:5173

## 👤 Usuario por defecto
- **Usuario**: `luca`
- **Contraseña**: `admin123`

## 🔧 Comandos útiles

### Desarrollo
```bash
# Frontend
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Previsualizar build

# Backend
npm run dev          # Iniciar servidor con nodemon
npm start            # Iniciar servidor en producción
```

### Base de datos
```bash
# Verificar base de datos SQLite
node check-db.js     # Script temporal para verificar tablas
```

### Limpieza
```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Limpiar caché de npm
npm cache clean --force
```

## 🐛 Solución de problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port already in use"
```bash
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Terminar proceso (reemplazar PID con el número de proceso)
taskkill /PID <PID> /F
```

### Error: "Database connection failed"
- Verificar que el servidor backend esté ejecutándose
- Verificar que no haya errores en la consola del backend
- La base de datos SQLite se crea automáticamente

### Error: "CORS error"
- Verificar que el backend esté en puerto 3000
- Verificar que el frontend esté en puerto 5173
- Verificar configuración CORS en `backend/server.js`

## 📁 Estructura del proyecto

```
To-Do-Vite/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables
│   ├── pages/             # Páginas de la aplicación
│   ├── hooks/             # Custom hooks
│   ├── stores/            # Zustand stores
│   └── config/            # Configuración
├── backend/               # Backend Node.js
│   ├── routes/            # Rutas de la API
│   ├── controllers/       # Controladores
│   ├── services/          # Lógica de negocio
│   ├── middleware/        # Middlewares
│   ├── config/            # Configuración
│   └── database.sqlite    # Base de datos SQLite
└── README.md
```

## 🔍 Herramientas de desarrollo

### VS Code Extensions recomendadas
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **Prettier - Code formatter**
- **ESLint**

### Herramientas de línea de comandos
- **Git Bash** (incluido con Git)
- **Windows Terminal** (recomendado)
- **PowerShell** (alternativa)

## 📚 Recursos adicionales

### Documentación oficial
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tutoriales útiles
- [React Tutorial](https://react.dev/learn)
- [Node.js Tutorial](https://nodejs.org/en/learn/)
- [SQLite Tutorial](https://www.sqlite.org/quickstart.html)

## 🆘 Soporte

Si encuentras problemas:
1. Verificar que todos los requisitos estén instalados
2. Revisar la consola del navegador (F12)
3. Revisar la consola del servidor backend
4. Verificar que los puertos no estén ocupados
5. Reinstalar dependencias si es necesario 