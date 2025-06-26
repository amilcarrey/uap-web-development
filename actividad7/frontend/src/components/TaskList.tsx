import React from 'react';
import type { Task } from '../types/Task'; // ✅ importa el tipo correctamente

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}


const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete }) => {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between bg-white p-3 rounded shadow"
        >
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(Number(task.id), !task.completed)}
              className="form-checkbox"
            />
            <span className={task.completed ? 'line-through text-gray-500' : ''}>
              {task.text}
            </span>
          </label>
          <button
            onClick={() => onDelete(Number(task.id))}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
