import { useEffect, useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');

  const handleToggle = async (id) => {
  const response = await fetch(`http://localhost:5000/toggle/${id}`, {
    method: 'POST'
  });

  const handleDelete = async (id) => {
  await fetch(`http://localhost:5000/delete/${id}`, {
    method: 'POST'
  });

  setTasks(tasks.filter(task => task.id !== id));
};

const handleClearCompleted = async () => {
  await fetch('http://localhost:5000/clear_completed', {
    method: 'POST'
  });

  setTasks(tasks.filter(task => !task.completed));
};



  const data = await response.json();
  setTasks(tasks.map(task =>
    task.id === data.id ? { ...task, completed: data.completed } : task
  ));
};


  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error('Error al cargar tareas:', err));
  }, []);

  const getFilteredTasks = () => {
    if (filter === 'completed') return tasks.filter(t => t.completed);
    if (filter === 'incomplete') return tasks.filter(t => !t.completed);
    return tasks;
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const response = await fetch('http://localhost:5000/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: newTask })
    });

    const data = await response.json();
    setTasks([...tasks, data]);
    setNewTask('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-orange-500 mb-4">TO.DO</h1>

      <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea"
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">Agregar</button>
      </form>

      <div className="flex justify-center gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'font-bold' : ''}>Todas</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'font-bold' : ''}>Completadas</button>
        <button onClick={() => setFilter('incomplete')} className={filter === 'incomplete' ? 'font-bold' : ''}>Incompletas</button>
      </div>

      <ul className="space-y-2">
  {getFilteredTasks().map(task => (
    <li key={task.id} className="bg-gray-100 p-2 rounded flex justify-between items-center">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleToggle(task.id)}
        />
        <span className={task.completed ? 'line-through text-gray-500' : ''}>
          {task.text}
        </span>
      </label>
      <button onClick={() => handleDelete(task.id)} className="ml-2 hover:scale-110 transition-transform">
        🗑️
      </button>
    </li>
  ))}
</ul>
{tasks.some(t => t.completed) && (
  <div className="mt-4 text-center">
    <button
      onClick={handleClearCompleted}
      className="text-sm text-red-500 hover:underline"
    >
      Clear Completed
    </button>
  </div>
)}
    </div>
  );
}

export default App;
