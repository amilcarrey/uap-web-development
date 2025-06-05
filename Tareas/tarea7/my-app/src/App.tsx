// src/App.tsx
import React from 'react';
import { useConfigStore } from './store/configStore';
import { useUIStore } from './store/uiStore';
import { useBoardStore } from './store/boardStore';
import { useTasks } from './hooks/useTasks';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Pagination from './components/Pagination';
import TopBar from './components/TopBar';

export default function App() {
  const { refetchInterval, uppercase } = useConfigStore();
  const { currentPage, setPage } = useUIStore();
  // App.tsx
const { currentBoard } = useBoardStore(); // currentBoard: string
const { query, addTask, editTask, removeTask } = useTasks(currentBoard, currentPage, refetchInterval);


  const handleAddTask = (description: string) => {
    addTask.mutate({ description, completed: false, boardId: currentBoard });
  };

  const handleToggleTask = (taskId: number, completed: boolean) => {
    editTask.mutate({ id: taskId, updates: { completed: !completed } });
  };

  const handleDeleteTask = (taskId: number) => {
    removeTask.mutate(taskId);
  };

  const handleEditTask = (id: number, newDesc: string) => {
    editTask.mutate({ id, updates: { description: newDesc } });
  };

  if (query.isLoading) return <p>Cargando tareas...</p>;
  if (query.isError) return <p>Error al cargar tareas.</p>;

  const { tasks, total } = query.data ?? { tasks: [], total: 0 };

  return (
    <div className="max-w-xl mx-auto p-4">
      <TopBar />

      <h1 className="text-2xl font-bold mb-4">Tareas</h1>

      <TaskForm
        boardId={currentBoard}
        onTaskAdded={handleAddTask}
        onClose={() => {}}
      />


      <TaskList
        tasks={tasks}
        uppercase={uppercase}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
      />

      <Pagination
        total={total}
        currentPage={currentPage}
        onPageChange={setPage}
        limit={5}
      />
    </div>
  );
}
