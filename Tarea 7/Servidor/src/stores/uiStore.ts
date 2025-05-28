// src/stores/uiStore.ts
import { create } from 'zustand';

type UIState = {
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  editingTaskId: null,
  setEditingTaskId: (id) => set({ editingTaskId: id }),
}));
