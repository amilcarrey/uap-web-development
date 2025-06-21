# To-Do App con Vite + React

Una aplicación moderna de gestión de tareas construida con React, Vite, Tanstack Query y Zustand.

## 🚀 Características

### ✅ Implementado
- **Gestión de tareas con Tanstack Query**: Caching inteligente, sincronización automática y optimistic updates
- **Estado global con Zustand**: Gestión eficiente del estado de la aplicación
- **Componentes reutilizables**: TodoForm, TodoItem, TodoList, TodoFilters y Pagination
- **Paginación optimizada**: Paginación del lado del cliente con configuración flexible
- **Sistema de toasts**: Notificaciones consistentes usando Zustand
- **Filtros avanzados**: Filtrar por estado (todas, pendientes, completadas)
- **Ordenamiento**: Ordenar tareas por fecha, texto o estado
- **Optimistic updates**: Actualizaciones instantáneas con rollback en caso de error
- **Refetch automático**: Sincronización automática configurable
- **Persistencia**: Configuraciones guardadas en localStorage

### 🎯 Mejoras Implementadas

#### 1. **Tanstack Query Integration**
- Hooks personalizados para todas las operaciones CRUD
- Caching inteligente con configuración de stale time
- Optimistic updates para mejor UX
- Manejo automático de errores y reintentos
- Query invalidation automática

#### 2. **Zustand State Management**
- `taskStore`: Gestión de filtros, paginación y estado de edición
- `appStore`: Configuraciones globales y sistema de toasts
- Persistencia automática en localStorage
- Suscripciones reactivas

#### 3. **Componentes Reutilizables**
- **TodoForm**: Formulario con validación y estados de carga
- **TodoItem**: Item individual con edición inline
- **TodoList**: Lista con manejo de estados vacíos y errores
- **TodoFilters**: Filtros con iconos y estados de carga
- **Pagination**: Paginación avanzada con navegación inteligente

#### 4. **Hooks Personalizados**
- `useTaskManager`: Hook principal que combina Zustand + Tanstack Query
- `useTasks`: Hooks específicos para cada operación CRUD
- Configuración centralizada y reutilizable

## 🛠️ Tecnologías

- **Frontend**: React 19, Vite
- **Estado**: Zustand
- **Queries**: Tanstack Query (React Query)
- **Estilos**: Tailwind CSS
- **Iconos**: React Icons
- **Routing**: React Router DOM

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── TodoForm.jsx    # Formulario de tareas
│   ├── TodoItem.jsx    # Item individual
│   ├── TodoList.jsx    # Lista de tareas
│   ├── TodoFilters.jsx # Filtros
│   ├── Pagination.jsx  # Paginación
│   └── ToastContainer.jsx # Sistema de toasts
├── hooks/              # Hooks personalizados
│   ├── useTasks.js     # Hooks de Tanstack Query
│   └── useTaskManager.js # Hook principal
├── stores/             # Stores de Zustand
│   ├── taskStore.js    # Estado de tareas
│   ├── appStore.js     # Estado global
│   └── uiStore.js      # Estado de UI
├── pages/              # Páginas de la aplicación
│   └── BoardDetail.jsx # Página principal (refactorizada)
└── config/             # Configuración
    └── api.js          # Funciones de API
```

## 🚀 Instalación

```bash
npm install
npm run dev
```

## 📖 Uso

### Gestión de Tareas
- **Crear**: Usar el formulario en la parte superior
- **Editar**: Hacer clic en el icono de editar
- **Completar**: Hacer clic en el checkbox
- **Eliminar**: Hacer clic en el icono de eliminar
- **Filtrar**: Usar los botones de filtro
- **Paginación**: Navegar entre páginas

### Configuraciones
- **Refetch Interval**: Configurar en el store de la aplicación
- **Items por página**: Configurable en el store de tareas
- **Ordenamiento**: Por fecha, texto o estado

## 🔧 Configuración

### Tanstack Query
```javascript
// Configuración en main.jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
```

### Zustand Stores
```javascript
// taskStore.js - Estado de tareas
const useTaskStore = create((set, get) => ({
  filter: 'all',
  currentPage: 1,
  itemsPerPage: 5,
  // ... más estado y acciones
}));

// appStore.js - Estado global
const useAppStore = create((set, get) => ({
  settings: { refetchInterval: 30, itemsPerPage: 5 },
  toasts: [],
  // ... más estado y acciones
}));
```

## 🎨 Características de UX

- **Animaciones suaves**: Transiciones CSS personalizadas
- **Estados de carga**: Indicadores visuales para todas las operaciones
- **Mensajes de error**: Manejo consistente de errores
- **Responsive**: Diseño adaptativo
- **Accesibilidad**: Focus visible y navegación por teclado

## 🔄 Optimizaciones

- **Memoización**: Uso de useMemo para cálculos costosos
- **Lazy loading**: Componentes cargados bajo demanda
- **Caching**: Tanstack Query para cache inteligente
- **Optimistic updates**: Actualizaciones instantáneas
- **Debouncing**: Evitar llamadas innecesarias a la API

## 📝 Próximas Mejoras

- [ ] Paginación del lado del servidor
- [ ] Búsqueda en tiempo real
- [ ] Drag & drop para reordenar
- [ ] Temas personalizables
- [ ] Exportar/importar tareas
- [ ] Notificaciones push
- [ ] Modo offline

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
