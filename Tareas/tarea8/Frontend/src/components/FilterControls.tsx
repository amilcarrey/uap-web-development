import { useIsViewer } from '../hooks/useUserPermissions';
import toast from 'react-hot-toast';

// Component: Buttons to filter tasks and clear completed ones
export interface Props {
  tabId: string;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onClearCompleted: () => void;
}

export function FilterControls({ tabId, currentFilter, onFilterChange, onClearCompleted }: Props) {
  const isViewer = useIsViewer(tabId);

  const handleClearCompleted = () => {
    if (isViewer) {
      toast.error("No podés borrar tareas en este tablero");
      return;
    }
    onClearCompleted();
  };

  const filters = [
    { id: 'all', label: 'Todas' },
    { id: 'active', label: 'Pendientes' },
    { id: 'completed', label: 'Hechas' },
  ];

  return (
    <div className="filter-buttons-container flex gap-[10px] justify-center my-4 mx-0">
      {filters.map(filter => (
        <button
          key={filter.id}
          type="button"
          className={`px-3 py-1 rounded border transition-colors ${
            filter.id === currentFilter 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
          }`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </button>
      ))}

      <button 
        className={`px-3 py-1 rounded border transition-colors ${
          isViewer 
            ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed opacity-50' 
            : 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
        }`}
        onClick={handleClearCompleted}
        disabled={isViewer}
        title={isViewer ? "Sin permisos para borrar" : "Eliminar tareas hechas"}
      >
        Borrar hechas
      </button>
    </div>
  );
}
