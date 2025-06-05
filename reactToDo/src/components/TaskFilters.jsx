export default function TaskFilters({ 
  currentFilter, 
  onFilterChange, 
  onClearCompleted,
  activeCount 
}) {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-500">
        {activeCount} {activeCount === 1 ? 'item left' : 'items left'}
      </span>
      <div className="flex space-x-2">
        {['all', 'active', 'completed'].map(filterType => (
          <button
            key={filterType}
            onClick={() => onFilterChange(filterType)}
            className={`px-3 py-1 rounded-full text-sm capitalize ${
              currentFilter === filterType
                ? 'bg-blue-500 text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            {filterType}
          </button>
        ))}
      </div>
      <button
        onClick={onClearCompleted}
        className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-full"
      >
        Clear completed
      </button>
    </div>
  );
}