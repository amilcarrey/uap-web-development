import { create } from 'zustand';

type UIState = {
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  taskFilter: string;
  setTaskFilter: (filter: string) => void;
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
  isShareModalOpen: false,
  setShareModalOpen: (open) => set({ isShareModalOpen: open }),
  shareModalBoardId: null,
  setShareModalBoardId: (boardId) => set({ shareModalBoardId: boardId }),
}));
