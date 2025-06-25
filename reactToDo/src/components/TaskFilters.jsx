import { useState } from 'react';
import { useTasksByCategory, useTaskMutations } from '../hooks/useTasks';
import ConfirmationModal from './ConfirmationModal';

export default function TaskFilters({ 
  currentFilter, 
  onFilterChange,
  activeCount,
  onClearCompleted,
  isClearing,
  search,
  setSearch,
  showConfirm,
  setShowConfirm,
  handleConfirmClear
}) {
  return (
    <>
      <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-500">
          {activeCount} {activeCount === 1 ? 'item left' : 'items left'}
        </span>
        
        <div className="flex space-x-2">
          {['all', 'active', 'completed'].map(filterType => (
            <button
              key={filterType}
              onClick={() => onFilterChange(filterType)}
              className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
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
          disabled={isClearing}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            isClearing
              ? 'text-red-300 cursor-wait'
              : 'text-red-500 hover:bg-red-50'
          }`}
        >
          {isClearing ? 'Clearing...' : 'Clear completed'}
        </button>
      </div>
      <div className="flex gap-2 mb-4 items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar tarea..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1 pr-6"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
              aria-label="Limpiar búsqueda"
            >
              ×
            </button>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={handleConfirmClear}
        onCancel={() => setShowConfirm(false)}
        message="¿Estás seguro de que quieres eliminar todas las tareas completadas?"
      />
    </>
  );
}