import { useState } from 'react';

interface TaskSearchProps {
  onSearch: (query: string) => void;
}

const TaskSearch: React.FC<TaskSearchProps> = ({ onSearch }) => {
  const [input, setInput] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(input);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Buscar tarea..."
        className="flex-1 px-3 py-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Buscar
      </button>
    </form>
  );
};

export default TaskSearch;
