import { useState } from 'react';
import { useTaskMutations } from '../hooks/useTasks';

export default function AddTask({ category }) {
  const [taskText, setTaskText] = useState('');
  const [error, setError] = useState('');
  const { addTask } = useTaskMutations();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      setError('Please enter a task');
      return;
    }
    
    addTask.mutate(
      { text: taskText, category },
      {
        onSuccess: () => {
          setTaskText('');
          setError('');
        },
        onError: (err) => {
          setError(err.message || 'Failed to add task');
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <div className="flex-grow relative">
          <input
            type="text"
            value={taskText}
            onChange={(e) => {
              setTaskText(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="Add a new task..."
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
            }`}
            disabled={addTask.isPending}
          />
          {error && (
            <p className="absolute -bottom-5 left-0 text-xs text-red-500">
              {error}
            </p>
          )}
          {addTask.isPending && (
            <p className="absolute -bottom-5 left-0 text-xs text-blue-500">
              Adding task...
            </p>
          )}
        </div>
        <button
          type="submit"
          className={`px-4 py-2 text-white rounded-lg transition-colors ${
            addTask.isPending
              ? 'bg-blue-400 cursor-wait'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
          disabled={addTask.isPending}
        >
          {addTask.isPending ? 'Adding...' : 'Add'}
        </button>
      </div>
    </form>
  );
}