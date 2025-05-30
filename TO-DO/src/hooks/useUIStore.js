import { create } from 'zustand';

const useUIStore = create((set) => ({
  // Estado del modal
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  
  // Sistema de notificaciones
  notification: null,
  showNotification: (msg) => set({ notification: msg }),
  clearNotification: () => set({ notification: null }),
  
  // Filtros y categorías
  activeFilter: 'all',
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  
  activeCategory: 'all',
  setActiveCategory: (category) => set({ activeCategory: category }),
  
  // Estado de carga
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Estado de error
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  
  // Paginación
  currentPage: 1,
  itemsPerPage: 5,
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items }),
}));

export default useUIStore; 