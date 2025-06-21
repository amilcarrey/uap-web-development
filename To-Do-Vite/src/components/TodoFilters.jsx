import { FaList, FaClock, FaCheckCircle, FaTrash } from 'react-icons/fa';

function TodoFilters({ 
  currentFilter, 
  onFilterChange, 
  onClearCompleted, 
  completedCount = 0,
  isLoading = false,
  className = ""
}) {
  const filters = [
    { key: 'all', label: 'Todas', icon: FaList },
    { key: 'active', label: 'Pendientes', icon: FaClock },
    { key: 'completed', label: 'Completadas', icon: FaCheckCircle }
  ];

  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <div className="flex gap-2">
        {filters.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onFilterChange(key)}
            disabled={isLoading}
            className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-2 ${
              currentFilter === key 
                ? 'bg-purple-600 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
      
      {completedCount > 0 && (
        <button
          onClick={onClearCompleted}
          disabled={isLoading}
          className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Eliminar tareas completadas"
        >
          <FaTrash size={14} />
          Limpiar completadas
        </button>
      )}
    </div>
  );
}

export default TodoFilters; 