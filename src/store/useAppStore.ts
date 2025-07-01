import { create } from "zustand";
import { toast } from "react-toastify";

type Filter = "all" | "active" | "completed";

interface AppState {
  selectedBoard: string;
  filter: Filter;
  currentPage: number;
  setFilter: (f: Filter) => void;
  setBoard: (id: string) => void;
  setPage: (p: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedBoard: "general",
  filter: "all",
  currentPage: 1,
  setFilter: (filter) => set({ filter }),
  setBoard: (id) => set({ selectedBoard: id, currentPage: 1 }),
  setPage: (page) => {
    set({ currentPage: page });
    toast.info(`Página ${page}`);
  },
}));