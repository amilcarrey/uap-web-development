import { create } from 'zustand';

export const useClientStore = create((set) => ({
  modals: {
    isAddTaskModalOpen: false,
    isDeleteModalOpen: false,
    taskToDelete: null,
  },
  editingTask: null,
  notifications: [],
  pagination: {
    currentPage: 1,
    tasksPerPage: 5,
  },

  // Acciones para modales
  openAddTaskModal: () => set((state) => ({
    modals: { ...state.modals, isAddTaskModalOpen: true }
  })),
  closeAddTaskModal: () => set((state) => ({
    modals: { ...state.modals, isAddTaskModalOpen: false },
    editingTask: null
  })),
  openDeleteModal: (task) => set((state) => ({
    modals: { ...state.modals, isDeleteModalOpen: true, taskToDelete: task }
  })),
  closeDeleteModal: () => set((state) => ({
    modals: { ...state.modals, isDeleteModalOpen: false, taskToDelete: null }
  })),

  // Acciones para edición
  startEditing: (task) => set({ editingTask: task }),
  cancelEditing: () => set({ editingTask: null }),

  // Acciones para notificaciones
  addNotification: (message, type = 'info') =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), message, type }]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  // Acciones para paginación
  setCurrentPage: (page) => set((state) => ({
    pagination: { ...state.pagination, currentPage: page }
  })),
  setTasksPerPage: (limit) => set((state) => ({
    pagination: { ...state.pagination, tasksPerPage: limit }
  })),
}));