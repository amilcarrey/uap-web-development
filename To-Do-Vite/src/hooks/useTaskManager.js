import { useMemo, useEffect, useCallback } from 'react';
import useTaskStore from '../stores/taskStore';
import useAppStore from '../stores/appStore';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useDeleteCompletedTasks, useToggleTask } from './useTasks';

export const useTaskManager = (boardName) => {
  const {
    filter,
    searchTerm,
    currentPage,
    editingTaskId,
    setFilter,
    setSearchTerm,
    setCurrentPage,
    setEditingTask,
    clearEditingTask
  } = useTaskStore();

  const { itemsPerPage } = useAppStore(state => state.settings);

  // Limpiar búsqueda y paginación cuando cambia el tablero
  useEffect(() => {
    setSearchTerm('');
    setCurrentPage(1);
  }, [boardName, setSearchTerm, setCurrentPage]);

  // Resetear página si itemsPerPage cambia
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage, setCurrentPage]);

  // Parámetros para la query
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    filter
  };

  const { 
    data: result = { tasks: [], pagination: { totalTasks: 0, totalPages: 1 } }, 
    isLoading: isLoadingTasks, 
    error: tasksError,
    refetch
  } = useTasks(boardName, queryParams);
  
  const createTaskMutation = useCreateTask(boardName);
  const updateTaskMutation = useUpdateTask(boardName);
  const deleteTaskMutation = useDeleteTask(boardName);
  const deleteCompletedMutation = useDeleteCompletedTasks(boardName);
  const toggleTaskMutation = useToggleTask(boardName);

  // Extraer datos de la respuesta paginada
  const { tasks, pagination } = result;
  const { totalTasks, totalPages, page: serverPage } = pagination;

  // Contar tareas completadas (necesario para el filtro)
  const completedCount = tasks.filter(task => task.completed).length;

  const isLoading = isLoadingTasks || 
    createTaskMutation.isPending || 
    updateTaskMutation.isPending || 
    deleteTaskMutation.isPending || 
    deleteCompletedMutation.isPending || 
    toggleTaskMutation.isPending;

  const handleAddTask = async (text) => {
    await createTaskMutation.mutateAsync({ text });
  };

  const handleToggleTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toggleTaskMutation.mutate({ taskId, completed: !task.completed });
    }
  };

  const handleDeleteTask = (taskId) => {
    deleteTaskMutation.mutate({ taskId });
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setEditingTask(taskId);
    }
  };

  const handleSaveEdit = async (text) => {
    if (editingTaskId) {
      await updateTaskMutation.mutateAsync({ taskId: editingTaskId, updates: { text } });
      clearEditingTask();
    }
  };

  const handleCancelEdit = () => {
    clearEditingTask();
  };

  const handleClearCompleted = () => {
    deleteCompletedMutation.mutate();
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, [setCurrentPage]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
  }, [setFilter]);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, [setSearchTerm]);

  const getEmptyMessage = () => {
    if (searchTerm && tasks.length === 0) {
      return `No hay resultados para "${searchTerm}"`;
    }
    if (filter === 'all') return 'No hay tareas en este tablero';
    if (filter === 'active') return 'No hay tareas pendientes';
    if (filter === 'completed') return 'No hay tareas completadas';
    return 'No hay tareas';
  };

  return {
    tasks,
    totalTasks,
    totalPages,
    completedCount,
    isLoading,
    error: tasksError?.message || null,
    editingTaskId,
    filter,
    searchTerm,
    currentPage,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    handleEditTask,
    handleSaveEdit,
    handleCancelEdit,
    handleClearCompleted,
    handlePageChange,
    handleFilterChange,
    handleSearchChange,
    getEmptyMessage,
    refetch,
    mutations: {
      create: createTaskMutation,
      update: updateTaskMutation,
      delete: deleteTaskMutation,
      deleteCompleted: deleteCompletedMutation,
      toggle: toggleTaskMutation
    }
  };
}; 