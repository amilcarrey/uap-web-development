import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function TaskList({ tasks, onToggle, onDelete }) {
  const [taskToDelete, setTaskToDelete] = useState(null);

  return (
    <>
      <ul className="space-y-3">
        {tasks.map(task => (
          <li 
            key={task.id}
            className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <label className="flex items-center flex-grow cursor-pointer">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggle(task.id)}
                className="h-5 w-5 mr-3 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
              />
              <span className={`flex-grow ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.text}
              </span>
            </label>
            <button
              onClick={() => setTaskToDelete(task.id)}
              className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <ConfirmationModal
        isOpen={taskToDelete !== null}
        onConfirm={() => {
          onDelete(taskToDelete);
          setTaskToDelete(null);
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </>
  );
}