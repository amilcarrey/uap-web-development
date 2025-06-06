// src/pages/BoardPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import FilterButtons from '../components/FilterButtons';
import ClearCompletedButton from '../components/ClearCompletedButton';
import { useTasks, useAddTask, useUpdateTask, useDeleteTask, useClearCompleted } from '../hooks/useTasks';
import { useSettingsStore } from '../stores/settingsStore';
import { useToastStore } from '../stores/toastStore';

export default function BoardPage() {
  const { boardId } = useParams(); // extrae el :boardId de la URL
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 5; // cantidad de tareas por página

  // 1. Obtener configuraciones globales (refetchInterval y uppercase)
// DESPUÉS, cada uno por su cuenta:
const refetchInterval = useSettingsStore(state => state.refetchInterval);
const uppercase       = useSettingsStore(state => state.uppercase);


  // 2. Toasts
  const addToast = useToastStore(state => state.addToast);

  // 3. Cargar tareas con React Query
  const {
    data: tasksData,
    isLoading,
    isError,
    error,
  } = useTasks(boardId, { page, limit, refetchInterval: refetchInterval * 1000 });

  // 4. Mutations
  const addTaskMutation = useAddTask(boardId);
  const updateTaskMutation = useUpdateTask(boardId);
  const deleteTaskMutation = useDeleteTask(boardId);
  const clearCompletedMutation = useClearCompleted(boardId);

  // Al hacer una mutación, mostrar toast
  const handleAdd = async (title) => {
    try {
      await addTaskMutation.mutateAsync({ title, completed: false });
      addToast({ message: 'Tarea agregada', type: 'success' });
    } catch (err) {
      addToast({ message: err.message, type: 'error' });
    }
  };

  const handleToggle = async (id, current) => {
    try {
      await updateTaskMutation.mutateAsync({ id, updates: { completed: !current } });
      addToast({ message: 'Tarea actualizada', type: 'success' });
    } catch (err) {
      addToast({ message: err.message, type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTaskMutation.mutateAsync(id);
      addToast({ message: 'Tarea eliminada', type: 'success' });
    } catch (err) {
      addToast({ message: err.message, type: 'error' });
    }
  };

  const handleClearCompleted = async () => {
    try {
      await clearCompletedMutation.mutateAsync();
      addToast({ message: 'Completadas eliminadas', type: 'success' });
    } catch (err) {
      addToast({ message: err.message, type: 'error' });
    }
  };

  // 5. Filtrar tareas según Estado
  const tasks = tasksData?.tasks || []; // suponemos que el endpoint devuelve { tasks: [...], totalPages: n }
  const totalPages = tasksData?.totalPages || 1;
  let filtered = tasks;
  if (filter === 'active') filtered = tasks.filter(t => !t.completed);
  if (filter === 'completed') filtered = tasks.filter(t => t.completed);

  return (
    <div className="py-8 bg-amber-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-center">Tablero: {boardId}</h1>

        {/* 1) Sección de agregado */}
        <TaskInput onAdd={handleAdd} />

        {/* 2) Botones de filtro */}
        <FilterButtons filter={filter} onChangeFilter={setFilter} />

        {/* 3) Estados de loading / error */}
        {isLoading && <p className="text-center">Cargando tareas...</p>}
        {isError && <p className="text-center text-red-500">{error.message}</p>}

        {/* 4) Listado de tareas */}
        {!isLoading && !isError && (
          <TaskList
            tasks={filtered.map(task => ({
              ...task,
              title: uppercase ? task.title.toUpperCase() : task.title
            }))}
            onToggle={(id, completed) => handleToggle(id, completed)}
            onDelete={handleDelete}
          />
        )}

        {/* 5) Clear Completed */}
        {!isLoading && !isError && filtered.length > 0 && (
          <ClearCompletedButton onClear={handleClearCompleted} />
        )}

        {/* 6) Paginación */}
        {!isLoading && !isError && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setPage(old => Math.max(old - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(old => Math.min(old + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
