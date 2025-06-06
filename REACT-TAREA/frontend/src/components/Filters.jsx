// frontend/src/components/Filters.jsx
import React from 'react';

export default function Filters({ currentFilter, onChange }) {
  return (
    <div className="flex justify-center space-x-3 mb-6">
      <button
        className={`
          px-4 py-1 rounded-lg font-medium
          ${currentFilter === 'All' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        `}
        onClick={() => onChange('All')}
      >
        All
      </button>
      <button
        className={`
          px-4 py-1 rounded-lg font-medium
          ${currentFilter === 'Active' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        `}
        onClick={() => onChange('Active')}
      >
        Active
      </button>
      <button
        className={`
          px-4 py-1 rounded-lg font-medium
          ${currentFilter === 'Completed' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
        `}
        onClick={() => onChange('Completed')}
      >
        Completed
      </button>
    </div>
  );
}
