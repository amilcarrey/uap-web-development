// src/App.jsx
import React from 'react';
import { useTasks } from './hooks/useTasks';
import { useUIStore } from './store/useUIStore';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './styles/main.css';

export default function App() {
  const filter = useUIStore((s) => s.filter);
  const setFilter = useUIStore((s) => s.setFilter);

  const {
    tasks, isLoading, error,
    addTask, toggleTask, deleteTask
  } = useTasks();

  const filtered = tasks.filter(t =>
    filter === 'all' ? true :
    filter === 'complete' ? t.completed :
    !t.completed
  );

  return (
    <div className="app-container">
      <h1>Antes de Ameri</h1>
      {/* <img src="/duki.jpg" alt="Duki" /> */}
      {/* O usa una imagen online temporalmente */}
      <img src="duki.jpg" alt="Duki" />

      <TaskForm onAdd={(text) => addTask.mutate(text)} />

      <div className="filtros">
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('incomplete')}>Incompletas</button>
        <button onClick={() => setFilter('complete')}>Completadas</button>
      </div>

      {isLoading && <p>Cargando…</p>}
      {error && <p>Error al cargar tareas</p>}
      {!isLoading &&
        <TaskList
          tasks={filtered}
          onToggle={(id, completed) => toggleTask.mutate({ id, completed })}
          onDelete={(id) => deleteTask.mutate(id)}
        />
      }
    </div>
  );
}
