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
    clearEditingTask,
    getFilteredTasks,
    getSortedTasks
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

  const { 
    data: tasks = [], 
    isLoading: isLoadingTasks, 
    error: tasksError,
    refetch
  } = useTasks(boardName);
  
  const createTaskMutation = useCreateTask(boardName);
  const updateTaskMutation = useUpdateTask(boardName);
  const deleteTaskMutation = useDeleteTask(boardName);
  const deleteCompletedMutation = useDeleteCompletedTasks(boardName);
  const toggleTaskMutation = useToggleTask(boardName);

  const { filteredAndSortedTasks, completedCount, totalCount } = useMemo(() => {
    const filtered = getFilteredTasks(tasks);
    const sorted = getSortedTasks(filtered);
    const completed = tasks.filter(task => task.completed).length;

    return { 
      filteredAndSortedTasks: sorted,
      completedCount: completed,
      totalCount: tasks.length
    };
  }, [tasks, filter, searchTerm, getFilteredTasks, getSortedTasks]);

  const { paginatedTasks, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filteredAndSortedTasks.slice(startIndex, startIndex + itemsPerPage);
    const total = Math.max(1, Math.ceil(filteredAndSortedTasks.length / itemsPerPage));

    return {
      paginatedTasks: paginated,
      totalPages: total
    };
  }, [filteredAndSortedTasks, currentPage, itemsPerPage]);

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

  const handleEditTask = (task) => {
    setEditingTask(task.id, task.text);
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
    if (searchTerm && filteredAndSortedTasks.length === 0) {
      return `No hay resultados para "${searchTerm}"`;
    }
    if (filter === 'all') return 'No hay tareas en este tablero';
    if (filter === 'active') return 'No hay tareas pendientes';
    if (filter === 'completed') return 'No hay tareas completadas';
    return 'No hay tareas';
  };

  return {
    paginatedTasks,
    totalPages,
    completedCount,
    totalCount,
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