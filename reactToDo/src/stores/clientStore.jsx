import { create } from 'zustand';

export const useClientStore = create((set, get) => ({
  modals: {
    isAddTaskModalOpen: false,
    isDeleteModalOpen: false,
    isBoardModalOpen: false,
    taskToDelete: null,
    boardToDelete: null,
  },
  editingTask: null,
  notifications: [],
  pagination: {
    currentPage: 1,
    tasksPerPage: 5,
  },

  boards: [],
  activeBoard: null,

  setActiveBoard: (boardId) => set({ activeBoard: boardId }),
  addBoard: (board) => set((state) => ({
    boards: [...state.boards, board],
    activeBoard: board.id
  })),
  removeBoard: (boardId) => set((state) => {
    const newBoards = state.boards.filter(board => board.id !== boardId);
    const newActive = newBoards.length > 0 ? newBoards[0].id : null;
    return { boards: newBoards, activeBoard: newActive };
  }),
  openBoardModal: () => set((state) => ({
    modals: { ...state.modals, isBoardModalOpen: true }
  })),
  closeBoardModal: () => set((state) => ({
    modals: { ...state.modals, isBoardModalOpen: false }
  })),

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

  startEditing: (task) => set({ editingTask: task }),
  cancelEditing: () => set({ editingTask: null }),

  addNotification: (message, type = 'info') =>
    set((state) => ({
      notifications: [...state.notifications, { id: Date.now(), message, type }]
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  setCurrentPage: (page) => set((state) => ({
    pagination: { ...state.pagination, currentPage: page }
  })),
  setTasksPerPage: (limit) => set((state) => ({
    pagination: { ...state.pagination, tasksPerPage: limit }
  })),
  resetPagination: () => set((state) => ({
    pagination: { ...state.pagination, currentPage: 1 }
  })),
  resetBoards: () => set({ boards: [], activeBoard: null }),

  // Configuración global
  settings: {
    refetchInterval: 10000, // 10 segundos por defecto
    uppercaseDescriptions: false,
  },
  setRefetchInterval: (ms) =>
    set((state) => ({
      settings: { ...state.settings, refetchInterval: ms }
    })),
  setUppercaseDescriptions: (value) =>
    set((state) => ({
      settings: { ...state.settings, uppercaseDescriptions: value }
    })),
}));