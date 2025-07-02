import React from 'react';

type Filter = 'all' | 'active' | 'completed';

interface FilterButtonsProps {
  currentFilter: Filter;
  onChange: (filter: Filter) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ currentFilter, onChange }) => {
  const filters: Filter[] = ['all', 'active', 'completed'];

  return (
    <div className="flex space-x-2 mt-4">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`px-3 py-1 rounded ${
            currentFilter === filter
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;
