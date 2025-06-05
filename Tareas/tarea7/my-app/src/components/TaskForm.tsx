import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/Task';

interface TaskFormProps {
  boardId: string;
  initialTask?: Task;
  onClose?: () => void;
  onTaskAdded?: (description: string) => void;
}

export default function TaskForm({ onTaskAdded }: TaskFormProps) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onTaskAdded?.(description.trim());
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex">
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="flex-1 border p-2 rounded-l"
        placeholder="Agregar tarea"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
        Añadir
      </button>
    </form>
  );
}
