import { useEffect, useState } from 'react';
import { taskAPI } from './api';
import type { Task } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  const loadTasks = () => {
    if (filter === 'all') {
      setTasks(taskAPI.list());
    } else {
      setTasks(taskAPI.list(filter));
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]);

  const handleAdd = () => {
    if (!text.trim()) return;
    taskAPI.create(text.trim());
    setText('');
    loadTasks();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold text-center mb-4 text-orange-600">TODO</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Agregar nueva tarea..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'font-bold text-orange-600' : ''}>All</button>
        <button onClick={() => setFilter('incomplete')} className={filter === 'incomplete' ? 'font-bold text-orange-600' : ''}>Incomplete</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'font-bold text-orange-600' : ''}>Completed</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id} className="flex justify-between items-center border-b py-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {
                  taskAPI.toggle(task.id);
                  loadTasks();
                }}
              />
              <span className={task.completed ? 'line-through text-gray-500' : ''}>
                {task.text}
              </span>
            </label>
            <button
              onClick={() => {
                taskAPI.delete(task.id);
                loadTasks();
              }}
              className="text-red-500 hover:text-red-700"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => {
          taskAPI.clearCompleted();
          loadTasks();
        }}
        className="mt-4 text-sm text-orange-600 hover:underline"
      >
        Clear Completed
      </button>
    </div>
  );
}

export default App;