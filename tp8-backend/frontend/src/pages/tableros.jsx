// src/pages/Tableros.jsx
import React from 'react';
import BoardSelector from '../components/BoardSelector';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';
import { useBoardsStore } from '../store/useBoardsStore';
import { useUIStore } from '../store/useUIStore';

export default function Tableros() {
  const { current } = useBoardsStore();
  const {
    tasks,
    addTask,
    editTask,
    deleteTask,
    toggleTask,
  } = useTasks(); // ✅ No pasás `current`, el hook lo obtiene internamente

  const { setEditingTask } = useUIStore();

  return (
    <div className="container">
      <h1>Mis Tableros</h1>
      <BoardSelector />

      <TaskForm
        onAdd={(text) => addTask.mutate(text)}
        onEdit={(id, text) => editTask.mutate({ id, text })}
      />

      <TaskList
        tasks={tasks}
        onToggle={(id, completed) => toggleTask.mutate({ id, completed })}
        onDelete={(id) => deleteTask.mutate(id)}
        onEditStart={setEditingTask}
      />
    </div>
  );
}
