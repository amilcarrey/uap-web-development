// src/stores/uiStore.ts
import { create } from 'zustand';

type UIState = {
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  taskFilter: string;
  setTaskFilter: (filter: string) => void;
  // Nuevos estados para permisos
  isShareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  shareModalBoardId: string | null;
  setShareModalBoardId: (boardId: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  editingTaskId: null,
  setEditingTaskId: (id) => set({ editingTaskId: id }),
  taskFilter: 'all',
  setTaskFilter: (filter) => set({ taskFilter: filter }),
  // Estados para el modal de compartir
  isShareModalOpen: false,
  setShareModalOpen: (open) => {
    console.log('🔄 uiStore: setShareModalOpen llamado con:', open);
    set({ isShareModalOpen: open });
  },
  shareModalBoardId: null,
  setShareModalBoardId: (boardId) => {
    console.log('🔄 uiStore: setShareModalBoardId llamado con:', boardId);
    set({ shareModalBoardId: boardId });
  },
}));
