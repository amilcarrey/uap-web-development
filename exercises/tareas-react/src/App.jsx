// src/App.jsx
import React, { useState, useEffect } from 'react';
import TaskInput from './components/TaskInput';
import FilterButtons from './components/FilterButtons';
import TaskList from './components/TaskList';
import ClearCompletedButton from './components/ClearCompletedButton';
import "./index.css";


function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const API_URL = 'http://localhost:4000/tasks';

  // 1. Cargar tareas al montar
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error('Error al cargar tareas:', err);
    }
  }

  // 2. Agregar tarea
  async function addTask(title) {
    const newTask = { title, completed: false };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const created = await res.json();
      setTasks(prev => [...prev, created]);
    } catch (err) {
      console.error('Error al crear tarea:', err);
    }
  }

  // 3. Alternar completado
  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const payload = { completed: !task.completed };
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Error al alternar tarea:', err);
    }
  }

  // 4. Eliminar tarea
  async function deleteTask(id) {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  }

  // 5. Clear Completed
  async function clearCompleted() {
    // Si JSON Server admite DELETE /tasks?completed=true, lo podés usar:
    // await fetch(`http://localhost:4000/tasks?completed=true`, { method: 'DELETE' });
    // setTasks(prev => prev.filter(t => !t.completed));

    // Si no, borrás una por una:
    const completedTasks = tasks.filter(t => t.completed);
    for (const t of completedTasks) {
      await fetch(`${API_URL}/${t.id}`, { method: 'DELETE' });
    }
    setTasks(prev => prev.filter(t => !t.completed));
  }

  // 6. Tareas filtradas según estado
  function getFilteredTasks() {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  }
  const filteredTasks = getFilteredTasks();

  return (
    <div className="py-8 max-auto bg-amber-50"> 
      <div className="max-w-xl mx-auto min-h-screen">
        <h1 className="text-2xl font-bold mb-4 flex justify-center">Hace lo que pinte</h1>

        {/* Input + agregar */}
        <TaskInput onAdd={addTask} />

        {/* Botones de filtro */}
        <FilterButtons filter={filter} onChangeFilter={setFilter} />

        {/* Lista de tareas ya filtrada */}
        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />

        {/* Botón para borrar completadas */}
        <ClearCompletedButton onClear={clearCompleted} />
      </div>
    </div>
  );
}

export default App;
