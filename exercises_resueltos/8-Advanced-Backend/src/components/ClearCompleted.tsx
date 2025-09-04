import React from 'react';
import { useClearCompletedTasks } from "../hooks/tasks/useClearCompleted"; // Renamed hook
import { toastError } from '../lib/toast';

interface ClearCompletedProps {
  boardId: number; // Selected board's ID
  disabled?: boolean;
}

export const ClearCompleted: React.FC<ClearCompletedProps> = ({ boardId, disabled = false }) => {
  const clearCompletedMutation = useClearCompletedTasks();

  const handleClear = () => {
    if (disabled) return;
    if (!boardId) {
        toastError("No board selected to clear tasks from.");
        return;
    }
    if (window.confirm("Are you sure you want to clear all completed tasks for this board?")) {
        clearCompletedMutation.mutate({ boardId });
    }
  };

  return (
    <button
      onClick={handleClear}
      className={`text-sm mt-6 block ml-auto transition-colors
                  ${disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-red-500 hover:text-red-700 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 rounded px-2 py-1'}`}
      disabled={disabled || clearCompletedMutation.isPending}
    >
      {clearCompletedMutation.isPending ? 'Clearing...' : 'Clear Completed Tasks'}
    </button>
  );
};