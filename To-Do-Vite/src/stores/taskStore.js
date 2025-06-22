import { create } from 'zustand';

const useTaskStore = create((set, get) => ({
  filter: 'all',
  searchTerm: '',
  currentPage: 1,
  editingTaskId: null,
  
  setFilter: (filter) => {
    set({ filter, currentPage: 1 });
  },
  
  setSearchTerm: (term) => {
    set({ searchTerm: term, currentPage: 1 });
  },
  
  setCurrentPage: (page) => set({ currentPage: page }),
  
  setEditingTask: (taskId) => set({ editingTaskId: taskId }),

  clearEditingTask: () => set({ editingTaskId: null }),
  
  getFilteredTasks: (tasks) => {
    const { filter, searchTerm } = get();
    if (!tasks) return [];
    
    const lowercasedTerm = searchTerm.toLowerCase();

    return tasks.filter(task => {
      const filterPasses = (filter === 'all') || 
                           (filter === 'active' && !task.completed) || 
                           (filter === 'completed' && task.completed);
      
      const searchPasses = !lowercasedTerm || task.text.toLowerCase().includes(lowercasedTerm);

      return filterPasses && searchPasses;
    });
  },
  
  getSortedTasks: (tasks) => {
    if (!tasks) return [];
    
    return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
}));

export default useTaskStore; 