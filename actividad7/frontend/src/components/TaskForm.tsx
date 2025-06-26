import { useState } from 'react';
import { useAddTask } from '../hooks/useAddTask';

const TaskForm = () => {
  const [text, setText] = useState('');
  const addTask = useAddTask();

  const handleAdd = () => {
    if (text.trim()) {
      addTask.mutate(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="flex gap-2">
      <input
        className="border p-2 flex-1"
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Agregar tarea..."
      />
      <button className="bg-blue-500 text-white px-4" onClick={handleAdd}>
        Agregar
      </button>
    </div>
  );
};

export default TaskForm;
