import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Estado de los modales
  isSettingsModalOpen: false,
  isCreateBoardModalOpen: false,
  isEditTaskModalOpen: false,
  
  activeFilter: 'all',
  activeCategory: 'all',
  
  currentPage: 1,
  itemsPerPage: 4,
  
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),
  openCreateBoardModal: () => set({ isCreateBoardModalOpen: true }),
  closeCreateBoardModal: () => set({ isCreateBoardModalOpen: false }),
  openEditTaskModal: () => set({ isEditTaskModalOpen: true }),
  closeEditTaskModal: () => set({ isEditTaskModalOpen: false }),
  
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items }),
  
  resetUIState: () => set({
    isSettingsModalOpen: false,
    isCreateBoardModalOpen: false,
    isEditTaskModalOpen: false,
    activeFilter: 'all',
    activeCategory: 'all',
    currentPage: 1,
    itemsPerPage: 4
  })
}));

export default useUIStore; 