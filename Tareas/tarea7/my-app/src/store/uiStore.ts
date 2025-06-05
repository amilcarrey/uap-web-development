import { create } from 'zustand';

type UIState = {
  currentPage: number;
  editingTaskId: number | null;
  setPage: (page: number) => void;
  setEditingTaskId: (id: number | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  currentPage: 1,
  editingTaskId: null,
  setPage: (page) => set({ currentPage: page }),
  setEditingTaskId: (id) => set({ editingTaskId: id }),
}));
