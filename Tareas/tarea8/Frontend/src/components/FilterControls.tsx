//src\components\FilterControls.tsx

import { useIsViewer } from '../hooks/useUserPermissions';
import toast from 'react-hot-toast';

// Definición de las propiedades que recibe el componente FilterControls
export interface Props {
  tabId: string;                                // ID de la pestaña actual, para identificar el contexto de las tareas
  currentFilter: string;                        // Filtro activo actual, puede ser "all", "active" o "completed"
  onFilterChange: (filter: string) => void;     // Función que se llama al cambiar el filtro, recibe el nuevo filtro como argumento
  onClearCompleted: () => void;                 // Función que se llama al limpiar las tareas completadas 
}

/*
Componente FilterControls
Muestra los botones para filtrar la lista de tareas por estado:
  - Todos
  - Activos (pendientes)
  - Completados

 También incluye un botón para limpiar (eliminar) las tareas que ya están completadas.
 Usa botones HTML simples con estilos Tailwind para mantener consistencia visual.
 */
export function FilterControls({
  tabId,                        // ID de la pestaña actual
  currentFilter,                // Filtro global activo
  onFilterChange,               // Cambia el filtro global (Zustand)
  onClearCompleted              // Elimina todas las tareas completadas
}: Props) {
  // Detectar si el usuario es VIEWER
  const isViewer = useIsViewer(tabId);

  // Función para manejar limpiar completadas
  const handleClearCompleted = () => {
    if (isViewer) {
      toast.error("No tienes permisos para eliminar tareas en este tablero");
      return;
    }
    onClearCompleted();
  };

  // Opciones de filtro disponibles
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="filter-buttons-container flex gap-[10px] justify-center my-4 mx-0">
      {/* Botones para cambiar el filtro global de tareas */}
      {filters.map(filter => (
        <button
          key={filter.id}
          type="button"
          className={`px-3 py-1 rounded border transition-colors ${
            filter.id === currentFilter 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
          onClick={() => onFilterChange(filter.id)} // Cambia el filtro global al hacer clic
        >
          {filter.label}
        </button>
      ))}

      {/* Botón para limpiar todas las tareas completadas */}
      <button 
        className={`px-3 py-1 rounded border transition-colors ${
          isViewer 
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-50' 
            : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
        }`}
        onClick={handleClearCompleted}
        disabled={isViewer}
        title={isViewer ? "No tienes permisos para eliminar tareas" : "Limpiar todas las tareas completadas"}
      >
        Limpiar completadas
      </button>
    </div>
  );
}
