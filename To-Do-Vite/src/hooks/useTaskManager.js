import { useMemo } from 'react';
import useTaskStore from '../stores/taskStore';
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask, useDeleteCompletedTasks, useToggleTask } from './useTasks';

export const useTaskManager = (boardName) => {
  const {
    filter,
    searchTerm,
    currentPage,
    itemsPerPage,
    editingTaskId,
    setFilter,
    setSearchTerm,
    setCurrentPage,
    setEditingTask,
    clearEditingTask,
    getFilteredTasks,
    getSortedTasks,
    getPaginatedTasks
  } = useTaskStore();

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

  const processedData = useMemo(() => {
    const filteredTasks = getFilteredTasks(tasks);
    const sortedTasks = getSortedTasks(filteredTasks);
    const paginatedTasks = getPaginatedTasks(sortedTasks);
    const totalPages = Math.max(1, Math.ceil(sortedTasks.length / itemsPerPage));
    const completedCount = tasks.filter(task => task.completed).length;
    const activeCount = tasks.filter(task => !task.completed).length;

    return {
      filteredTasks,
      sortedTasks,
      paginatedTasks,
      totalPages,
      completedCount,
      activeCount,
      totalCount: tasks.length
    };
  }, [tasks, filter, currentPage, itemsPerPage, getFilteredTasks, getSortedTasks, getPaginatedTasks]);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const getEmptyMessage = () => {
    if (searchTerm && processedData.filteredTasks.length === 0) {
      return `No hay resultados para "${searchTerm}"`;
    }
    if (filter === 'all') return 'No hay tareas en este tablero';
    if (filter === 'active') return 'No hay tareas pendientes';
    if (filter === 'completed') return 'No hay tareas completadas';
    return 'No hay tareas';
  };

  return {
    ...processedData,
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