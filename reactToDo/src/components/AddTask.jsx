import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      setError('Please enter a task');
      return;
    }
    onAddTask(taskText);
    setTaskText('');
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <div className="flex-grow relative">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Add a new task..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p className="absolute top-full left-0 mt-1 text-sm text-danger">
              {error}
            </p>
          )}
        </div>
        <button 
          type="submit"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}