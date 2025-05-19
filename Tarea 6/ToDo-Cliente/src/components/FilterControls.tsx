import { CustomButton } from './UiButton'; // Componente de botón personalizado, importado correctamente

/**
 * Props que recibe FilterControls:
 * - tabId: id de la pestaña para identificar el control (aunque no se usa en lógica, puede servir para testing o accesibilidad)
 * - currentFilter: filtro activo actual ("all", "active", "completed")
 * - onFilterChange: función para cambiar el filtro cuando el usuario hace clic en un botón
 * - onClearCompleted: función para limpiar todas las tareas completadas
 */
export interface Props {
  tabId: string;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
}

/**
 * Componente FilterControls
 *
 * Muestra los botones para filtrar la lista de tareas por estado:
 * - Todos
 * - Activos (pendientes)
 * - Completados
 * 
 * También incluye un botón para limpiar (eliminar) las tareas que ya están completadas.
 *
 * Usa un componente CustomButton para mantener estilo y comportamiento uniforme.
 */
export function FilterControls({
  tabId,
  currentFilter,
  onFilterChange,
  onClearCompleted
}: Props) {
  // Definimos las opciones de filtro con id y etiqueta visible
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="filter-buttons-container flex gap-[10px] justify-center my-4 mx-0">
      {/* Botones para cambiar el filtro activo */}
      {filters.map(filter => (
        <CustomButton
          key={filter.id}
          type="button"
          isActive={filter.id === currentFilter} // Resalta el botón activo
          onClick={() => onFilterChange(filter.id)} // Cambia el filtro cuando se clickea
        >
          {filter.label}
        </CustomButton>
      ))}

      {/* Botón para limpiar las tareas completadas */}
      <CustomButton type="button" onClick={onClearCompleted}>
        Limpiar completadas
      </CustomButton>
    </div>
  );
}
