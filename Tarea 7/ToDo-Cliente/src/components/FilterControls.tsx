//src\components\FilterControls.tsx

import { CustomButton } from './UiButton'; // Componente de botón personalizado, importado correctamente

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
 Usa un componente CustomButton para mantener estilo y comportamiento uniforme.
 */
export function FilterControls({
  tabId,                        // ID de la pestaña actual (no se usa directamente)
  currentFilter,                // Filtro global activo
  onFilterChange,               // Cambia el filtro global (Zustand)
  onClearCompleted              // Elimina todas las tareas completadas
}: Props) {
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
        <CustomButton
          key={filter.id}
          type="button"
          isActive={filter.id === currentFilter} // Resalta el botón activo
          onClick={() => onFilterChange(filter.id)} // Cambia el filtro global al hacer clic
        >
          {filter.label}
        </CustomButton>
      ))}

      {/* Botón para limpiar todas las tareas completadas */}
      <CustomButton type="button" onClick={onClearCompleted}>
        Limpiar completadas
      </CustomButton>
    </div>
  );
}
