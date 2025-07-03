import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTasks } from './hooks/useTasks';
import { useUIStore } from './store/useUIStore';
import TaskForm from './components/TaskForm';
import BoardSelector from './components/BoardSelector';
import TaskList from './components/TaskList';
import Register from './pages/Register';
import Login from './pages/login'; // asumiendo que también lo tenés


import './styles/main.css';

function MainApp() {
  const filter = useUIStore((s) => s.filter);
  const setFilter = useUIStore((s) => s.setFilter);

  const {
    tasks, isLoading, error,
    addTask, toggleTask, deleteTask, editTask
  } = useTasks();

  const [editingTask, setEditingTask] = useState(null);

  const filtered = tasks.filter(t =>
    filter === 'all' ? true :
    filter === 'complete' ? t.completed :
    !t.completed
  );

  return (
    <div className="app-container">
      <h1>Antes de Ameri</h1>
      <img src="duki.jpg" alt="Duki" />

      <BoardSelector />

      <TaskForm
        isEditing={!!editingTask}
        initialText={editingTask?.contenido || ''}
        onAdd={(text) => addTask.mutate(text)}
        onEdit={(text) => {
          if (editingTask) {
            editTask.mutate({ id: editingTask.id, text });
            setEditingTask(null);
          }
        }}
        onCancel={() => setEditingTask(null)}
      />

      <div className="filtros">
        <button onClick={() => setFilter('all')}>Todas</button>
        <button onClick={() => setFilter('incomplete')}>Incompletas</button>
        <button onClick={() => setFilter('complete')}>Completadas</button>
      </div>

      {isLoading && <p>Cargando…</p>}
      {error && <p>Error al cargar tareas</p>}
      {!isLoading && (
        <TaskList
          tasks={filtered}
          onToggle={(id, completed) => toggleTask.mutate({ id, completed })}
          onDelete={(id) => deleteTask.mutate(id)}
          onEditStart={(task) => setEditingTask(task)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}