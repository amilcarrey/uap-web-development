import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { useTasksByCategory, useTaskMutations } from '../hooks/useTasks';

export default function TaskList({ category, filter }) {
  const [taskToDelete, setTaskToDelete] = useState(null);
  const { data: tasks = [], isLoading, error } = useTasksByCategory(category);
  const { toggleTask, deleteTask } = useTaskMutations();

  const filteredTasks = () => {
    switch(filter) {
      case 'active': return tasks.filter(task => !task.completed);
      case 'completed': return tasks.filter(task => task.completed);
      default: return tasks;
    }
  };

  if (isLoading) return <div className="p-4 text-center text-gray-500">Loading tasks...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;

  return (
    <>
      <ul className="space-y-3">
        {filteredTasks().map(task => (
          <li 
            key={task.id}
            className={`flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all ${
              toggleTask.isPending ? 'opacity-50' : ''
            }`}
          >
            <label className="flex items-center flex-grow cursor-pointer">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask.mutate({
                  id: task.id,
                  completed: !task.completed,
                  category
                })}
                disabled={toggleTask.isPending}
                className="h-5 w-5 mr-3 rounded border-gray-300 text-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
              <span className={`flex-grow ${
                task.completed ? 'line-through text-gray-400' : 'text-gray-700'
              }`}>
                {task.text}
              </span>
            </label>
            <button
              onClick={() => setTaskToDelete(task)}
              disabled={deleteTask.isPending}
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onConfirm={() => {
          deleteTask.mutate(
            { id: taskToDelete.id, category },
            {
              onSuccess: () => setTaskToDelete(null)
            }
          );
        }}
        onCancel={() => setTaskToDelete(null)}
        isLoading={deleteTask.isPending}
      />
    </>
  );
}