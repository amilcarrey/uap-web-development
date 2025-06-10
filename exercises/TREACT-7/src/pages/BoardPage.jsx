// src/pages/BoardPage.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import NavTableros from '../components/NavTableros';
import TaskInput from '../components/TaskInput';
import TaskList from '../components/TaskList';
import FilterButtons from '../components/FilterButtons';
import ClearCompletedButton from '../components/ClearCompletedButton';
import Pagination from '../components/Pagination';

import {
  useTasks,
  useCreateTask,
  useToggleTask,
  useDeleteTask,
  useClearCompleted,
} from '../hooks/useTasks';

export default function BoardPage() {
  const { boardId } = useParams();
  const [page, setPage] = useState(1);
  const limit = 5;

  // Nuevo estado local para "filtros": all | active | completed
  const [filter, setFilter] = useState('all');

  // React Query para obtener tareas (paginadas)
  const {
    data: tasksData,
    isLoading,
    isError,
    isFetching,
  } = useTasks(boardId, page, limit);

  const createTaskMutation = useCreateTask(boardId);
  const toggleTaskMutation = useToggleTask(boardId);
  const deleteTaskMutation = useDeleteTask(boardId);
  const clearCompletedMutation = useClearCompleted(boardId);

  function handleAddTask(title) {
    createTaskMutation.mutate(title);
  }
  function handleToggle(task) {
    toggleTaskMutation.mutate({ id: task.id, completed: task.completed });
  }
  function handleDelete(task) {
    deleteTaskMutation.mutate(task.id);
  }
  function handleClearCompleted() {
    clearCompletedMutation.mutate();
  }

  if (isError) return <p>Error al cargar tareas</p>;
  if (isLoading) return <p>Cargando tareas…</p>;

  // extraemos datos de la respuesta paginada
  const { data: tasks, totalPages, page: currentPage } = tasksData;

  // Filtrar en front-end según filtro seleccionado
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true; // "all"
  });

  return (
    <div className="py-8 bg-amber-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        {/* ===== Barra de tableros (misma que filtros) ===== */}
        <NavTableros />

        {/* Título y enlace a Configuraciones */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tablero #{boardId}</h2>
          <Link to="/settings" className="text-blue-600 hover:underline">
            Configuraciones
          </Link>
        </div>

        {/* ===== TaskInput + Botón “Agregar” ===== */}
        <TaskInput onAdd={handleAddTask} />

        {/* ===== Indicador “fetching” ===== */}
        {isFetching && (
          <p className="text-sm text-gray-500 mb-2">Actualizando…</p>
        )}

        {/* ===== Botones de filtro (All / Active / Completed) ===== */}
        <FilterButtons filter={filter} onChangeFilter={setFilter} />

        {/* ===== Lista de tareas ya filtrada ===== */}
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onDelete={handleDelete}
          boardId={boardId}
        />

        {/* ===== Botón “Limpiar completadas” ===== */}
        <ClearCompletedButton onClear={handleClearCompleted} />

        {/* ===== Paginación ===== */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
