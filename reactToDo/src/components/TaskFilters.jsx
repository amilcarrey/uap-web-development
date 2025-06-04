export default function TaskFilters({ currentFilter, onFilterChange, onClearCompleted }) {
  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex space-x-2">
        {['all', 'active', 'completed'].map(filterType => (
          <button
            key={filterType}
            className={`
              px-3 py-1 rounded-full text-sm capitalize
              ${currentFilter === filterType
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'}
            `}
            onClick={() => onFilterChange(filterType)}
          >
            {filterType}
          </button>
        ))}
      </div>
      <button
        onClick={onClearCompleted}
        className="px-3 py-1 bg-danger/10 text-danger rounded-full text-sm hover:bg-danger/20"
      >
        Clear completed
      </button>
    </div>
  );
}