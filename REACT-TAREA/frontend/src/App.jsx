// frontend/src/App.jsx
import React, { useEffect, useState } from 'react';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearCompleted,
} from './api/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Filters from './components/Filters';

export default function App() {
  const [tasks, setTasks] = useState([]);      // Siempre iniciamos con un arreglo vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchTasks();
        // Aquí nos aseguramos de que `data` sea un arreglo:
        if (!Array.isArray(data)) {
          throw new Error('Backend no devolvió un arreglo de tareas');
        }
        setTasks(data);
      } catch (err) {
        setError(err.message);
        setTasks([]); // Para evitar que tasks sea otra cosa
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAdd(text) {
    try {
      const newTask = await createTask(text);
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleToggle(id, newCompleted) {
    try {
      const updated = await updateTask(id, { completed: newCompleted });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleEdit(id, newText) {
    try {
      const updated = await updateTask(id, { text: newText });
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? updated : t))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleClearCompleted() {
    try {
      await clearCompleted();
      setTasks((prev) => prev.filter((t) => !t.completed));
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Todo App
        </h1>

        <TaskForm onAdd={handleAdd} />

        <Filters currentFilter={filter} onChange={setFilter} />

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <TaskList
            tasks={tasks}
            currentFilter={filter}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>
    </div>
  );
}
