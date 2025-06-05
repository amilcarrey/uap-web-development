import React from 'react';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  uppercase: boolean;
  onToggle: (taskId: number, completed: boolean) => void;
  onDelete: (taskId: number) => void;
  onEdit: (id: number, newDesc: string) => void;
}

export default function TaskList({
  tasks,
  uppercase,
  onToggle,
  onDelete,
  onEdit,
}: TaskListProps) {
  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex justify-between items-center">
          <span
            className={`flex-1 ${
              task.completed ? 'line-through text-gray-400' : ''
            }`}
          >
            {uppercase ? task.description.toUpperCase() : task.description}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => onToggle(task.id, !task.completed)}
              className="text-sm text-green-600"
            >
              ✔
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-sm text-red-600"
            >
              🗑
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
