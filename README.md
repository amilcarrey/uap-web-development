# To-Do App con React y Vite

Una aplicación de gestión de tareas moderna construida con React, Vite y Tailwind CSS. Permite crear múltiples tableros de tareas, organizarlos por categorías y gestionar tareas con funcionalidades como edición, eliminación y marcado de completadas.

## Características

- 📋 Múltiples tableros de tareas
- 🏷️ Categorización de tableros (Personal/Universidad)
- ✏️ Edición de tareas
- ✅ Marcado de tareas completadas
- 🔄 Actualización automática de tareas
- ⚙️ Configuraciones personalizables
- 📱 Diseño responsive
- 🎨 Interfaz moderna con efectos de cristal
- 🔔 Sistema de notificaciones

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd To-Do-Vite
```

2. Instala las dependencias del frontend:
```bash
npm install
```

3. Instala las dependencias del backend:
```bash
cd backend
npm install
cd ..
```

## Configuración

1. Asegúrate de que el archivo `backend/boards.json` existe. Si no existe, se creará automáticamente al iniciar el servidor.

2. Verifica que el puerto 3000 esté disponible para el backend.

## Ejecución

1. Inicia el servidor backend:
```bash
cd backend
node server.js
```

2. En una nueva terminal, inicia el frontend:
```bash
npm run dev
```

3. Abre tu navegador y visita:
```
http://localhost:5173
```

## Uso

### Crear un Tablero
1. Haz clic en "Crear Tablero"
2. Ingresa un nombre para el tablero
3. Selecciona una categoría (Personal o Universidad)
4. Haz clic en "Crear"

### Gestionar Tareas
- Para agregar una tarea: Escribe en el campo de texto y presiona "Agregar"
- Para editar una tarea: Haz clic en el ícono de edición
- Para marcar como completada: Haz clic en el círculo junto a la tarea
- Para eliminar una tarea: Haz clic en el ícono de X

### Configuraciones
1. Ve a la página de Configuraciones
2. Ajusta el intervalo de actualización automática
3. Activa/desactiva la visualización en mayúsculas

## Tecnologías Utilizadas

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - React Query
  - React Router
  - Zustand

- Backend:
  - Node.js
  - Express
  - CORS

## Estructura del Proyecto

```
To-Do-Vite/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── context/       # Contextos de React
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Páginas de la aplicación
│   ├── store/         # Estado global con Zustand
│   └── config/        # Configuraciones
├── backend/
│   ├── server.js      # Servidor Express
│   └── boards.json    # Almacenamiento de datos
└── public/            # Archivos estáticos
```
