// src/stores/uiStore.ts
import { create } from 'zustand';

type UIState = {
  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;
  taskFilter: string;
  setTaskFilter: (filter: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  editingTaskId: null,
  setEditingTaskId: (id) => set({ editingTaskId: id }),
  taskFilter: 'all',
  setTaskFilter: (filter) => set({ taskFilter: filter }),
}));
