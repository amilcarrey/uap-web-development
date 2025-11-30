import { create } from "zustand";

type Filter = "all" | "active" | "completed";

interface UIState {
  filter: Filter;
  setFilter: (f: Filter) => void;

  editingTaskId: string | null;
  setEditingTaskId: (id: string | null) => void;

  page: number;
  setPage: (p: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),

  editingTaskId: null,
  setEditingTaskId: (editingTaskId) => set({ editingTaskId }),

  page: 1,
  setPage: (page) => set({ page }),
}));