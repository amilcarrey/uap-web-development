// actividad7/frontend/src/components/TaskItem.tsx
import React from 'react';
import type { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  // Añadir console.log para depuración
  console.log('Current task:', task);
  
  return (
    <li className="flex items-center justify-between bg-white p-3 rounded shadow">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => {
            console.log('Toggling task ID:', task.id); // Debug
            onToggle(task.id, !task.completed);
          }}
          className="form-checkbox"
        />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>
          {task.text}
        </span>
      </label>
      <button
        onClick={() => {
          console.log('Deleting task ID:', task.id); // Debug
          onDelete(task.id);
        }}
        className="text-red-500 hover:text-red-700"
      >
        ✕
      </button>
    </li>
  );
};

export default TaskItem;