function FilterButtons({ currentFilter, onChange }) {
    const filters = ['all', 'active', 'completed'];
  
    return (
      <div className="flex space-x-2 mt-4">
        {filters.map(f => (
          <button
            key={f}
            className={`px-3 py-1 rounded ${
              currentFilter === f ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => onChange(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
    );
  }
  
  export default FilterButtons;
  