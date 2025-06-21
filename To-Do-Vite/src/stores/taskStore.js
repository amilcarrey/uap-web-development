import { create } from 'zustand';

const useTaskStore = create((set, get) => ({
  // Estado de filtros
  filter: 'all',
  currentPage: 1,
  itemsPerPage: 5,
  
  // Estado de edición
  editingTaskId: null,
  editingTaskText: '',
  
  // Estado de configuración
  showCompletedTasks: true,
  sortBy: 'createdAt', // 'createdAt', 'text', 'completed'
  sortOrder: 'desc', // 'asc', 'desc'
  
  // Acciones para filtros
  setFilter: (filter) => {
    set({ filter, currentPage: 1 }); // Reset a página 1 al cambiar filtro
  },
  
  // Acciones para paginación
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),
  
  // Acciones para edición
  setEditingTask: (taskId, text) => set({ editingTaskId: taskId, editingTaskText: text }),
  clearEditingTask: () => set({ editingTaskId: null, editingTaskText: '' }),
  
  // Acciones para configuración
  setShowCompletedTasks: (show) => set({ showCompletedTasks: show }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  
  // Reset del estado
  resetTaskState: () => set({
    filter: 'all',
    currentPage: 1,
    itemsPerPage: 5,
    editingTaskId: null,
    editingTaskText: '',
    showCompletedTasks: true,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }),
  
  // Utilidades
  getFilteredTasks: (tasks) => {
    const { filter } = get();
    if (!tasks) return [];
    
    return tasks.filter(task => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
    });
  },
  
  getSortedTasks: (tasks) => {
    const { sortBy, sortOrder } = get();
    if (!tasks) return [];
    
    return [...tasks].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'text':
          comparison = a.text.localeCompare(b.text);
          break;
        case 'completed':
          comparison = a.completed === b.completed ? 0 : a.completed ? 1 : -1;
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  },
  
  getPaginatedTasks: (tasks) => {
    const { currentPage, itemsPerPage } = get();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tasks.slice(startIndex, endIndex);
  }
}));

export default useTaskStore; 