import { create } from 'zustand';

export const useClientStore = create((set) => ({
  // Estado para modales
  modals: {
    isAddTaskModalOpen: false,
    isDeleteModalOpen: false,
    taskToDelete: null,
  },

  // Estado para notificaciones
  notifications: [],

  // Acciones para modales
  openAddTaskModal: () => set((state) => ({ 
    modals: { ...state.modals, isAddTaskModalOpen: true } 
  })),
  closeAddTaskModal: () => set((state) => ({ 
    modals: { ...state.modals, isAddTaskModalOpen: false } 
  })),
  openDeleteModal: (task) => set((state) => ({ 
    modals: { ...state.modals, isDeleteModalOpen: true, taskToDelete: task } 
  })),
  closeDeleteModal: () => set((state) => ({ 
    modals: { ...state.modals, isDeleteModalOpen: false, taskToDelete: null } 
  })),

  // Acciones para notificaciones
  addNotification: (message, type = 'info') => 
    set((state) => ({ 
      notifications: [...state.notifications, { id: Date.now(), message, type }]
    })),
  removeNotification: (id) => 
    set((state) => ({ 
      notifications: state.notifications.filter((n) => n.id !== id)
    })),
}));