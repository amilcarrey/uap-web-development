import { useState } from 'react';
import { useTasksByCategory, useTaskMutations } from '../hooks/useTasks';
import ConfirmationModal from './ConfirmationModal';

export default function TaskFilters({ 
  currentFilter, 
  onFilterChange,
  category,
  boardId
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { data } = useTasksByCategory({ category, boardId });
  const tasks = data?.tasks || [];
  const { deleteCompletedTasks } = useTaskMutations(boardId);

  const activeCount = tasks.filter(t => !t.completed).length;

  const handleClearCompleted = () => setShowConfirm(true);

  const handleConfirm = () => {
    deleteCompletedTasks.mutate({ boardId, category }, {
      onSettled: () => setShowConfirm(false)
    });
  };

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
          onClick={handleClearCompleted}
          disabled={deleteCompletedTasks.isPending}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            deleteCompletedTasks.isPending
              ? 'text-red-300 cursor-wait'
              : 'text-red-500 hover:bg-red-50'
          }`}
        >
          {deleteCompletedTasks.isPending ? 'Clearing...' : 'Clear completed'}
        </button>
      </div>
      <ConfirmationModal
        isOpen={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
        message="¿Estás seguro de que quieres eliminar todas las tareas completadas?"
      />
    </>
  );
}