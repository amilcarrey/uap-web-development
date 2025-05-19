import { useEffect, useState } from 'react';
import TaskItem from './components/TaskItem';
import TaskFilters from './components/TaskFilters';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  
  useEffect(() => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(setTasks)
      .catch(err => console.error("Error cargando tareas:", err));
  }, []);

  
  const handleAdd = () => {
    if (input.trim() === '') return;
    fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input })
    })
      .then(res => res.json())
      .then(newTask => {
        setTasks([...tasks, newTask]);
        setInput('');
      })
      .catch(err => console.error("Error agregando tarea:", err));
  };

  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  
  const handleToggle = (id) => {
    const task = tasks.find(t => t.id === id);
    fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    }).then(() => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    });
  };

  
  const handleDelete = (id) => {
    fetch(`/api/tasks/${id}`, { method: "DELETE" })
      .then(() => {
        setTasks(tasks.filter(t => t.id !== id));
      });
  };

  
  const handleClear = () => {
    fetch("/api/tasks", { method: "DELETE" })
      .then(() => {
        setTasks(tasks.filter(t => !t.completed));
      });
  };

  const filteredTasks = tasks.filter(t =>
    filter === 'all' ? true :
    filter === 'active' ? !t.completed :
    t.completed
  );

  return (
    <div className="container">
      <h1>Gestión de Tareas</h1>

      <img
        src="https://images.pexels.com/photos/7845451/pexels-photo-7845451.jpeg"
        alt="Tareas"
      />

      <form className="add-form" onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nueva tarea"
        />
        <button type="button" onClick={handleAdd}>Agregar</button>
      </form>

      <TaskFilters filter={filter} setFilter={setFilter} />

      <ul className="task-list">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => handleToggle(task.id)}
            onDelete={() => handleDelete(task.id)}
          />
        ))}
      </ul>

      <form onSubmit={e => { e.preventDefault(); handleClear(); }}>
        <button type="submit">Limpiar completadas</button>
      </form>
    </div>
  );
}

export default App;
