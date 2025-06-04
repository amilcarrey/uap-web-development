import { create } from "zustand";

export type FilterOption = "all" | "done" | "undone";

interface TaskStore {
  currentFilter: FilterOption;
  setCurrentFilter: (filter: FilterOption) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  currentFilter: "all",
  setCurrentFilter: (filter) => set({ currentFilter: filter }),
}));
