import React from 'react';
import type { Task } from '../types/Task';
import TaskItem from './TaskItem';
import { toast } from 'react-hot-toast';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => Promise<void>;
  error?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onToggle, onDelete, error }) => {
  if (error) {
    toast.error('Error al cargar las tareas');
    return <p className="text-red-500">No se pudieron cargar las tareas.</p>;
  }

  if (tasks.length === 0) {
    return <p className="text-gray-500">No hay tareas para mostrar.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete} // ✅ Ahora sí está bien tipado
        />
      ))}
    </ul>
  );
};

export default TaskList;
