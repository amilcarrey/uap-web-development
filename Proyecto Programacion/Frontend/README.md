# Task Manager - Frontend

## 📋 Descripción

Aplicación web moderna de gestión de tareas construida con React, TypeScript y Vite. Permite crear, gestionar y compartir tableros de tareas con otros usuarios.

## ✨ Características Principales

- **🔐 Autenticación JWT** - Login y registro seguro
- **📋 Gestión de Tableros** - Crear, editar y eliminar tableros
- **✅ Gestión de Tareas** - CRUD completo de tareas
- **👥 Compartir Tableros** - Sistema de permisos (Propietario, Editor, Solo lectura)
- **🔍 Búsqueda y Filtros** - Buscar tareas y filtrar por estado
- **📄 Paginación** - Paginación eficiente controlada por el backend
- **⚙️ Configuraciones** - Panel unificado de configuraciones de usuario

## 🚀 Instalación y Desarrollo

### Instalar dependencias:
```bash
npm install
```

### Ejecutar en modo desarrollo:
```bash
npm run dev
```

### Compilar para producción:
```bash
npm run build
```

## 🔧 Tecnologías Utilizadas

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos y diseño
- **React Query** - Gestión de estado del servidor
- **Zustand** - Gestión de estado local
- **React Router** - Navegación
- **React Hot Toast** - Notificaciones

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes React
├── hooks/         # Custom hooks
├── stores/        # Stores de Zustand
├── types/         # Tipos TypeScript
├── utils/         # Utilidades
└── main.tsx       # Punto de entrada
```

## 🛡️ Autenticación

Para usar la aplicación necesitas crear una cuenta o usar estas credenciales de prueba:

```json
{
  "alias": "Daniel2102",
  "password": "Daniel"
}
```

## 🎯 Uso de la Aplicación

1. **Registrarse o iniciar sesión**
2. **Crear un tablero** usando el botón "+"
3. **Agregar tareas** al tablero  
4. **Compartir el tablero** con otros usuarios (botón compartir)
5. **Filtrar y buscar** tareas según sea necesario
6. **Configurar preferencias** desde el dropdown del usuario

## 🤝 Contribuir

Este es un proyecto educativo. Para sugerir mejoras:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request