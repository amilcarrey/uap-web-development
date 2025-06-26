// src/store/boardStore.ts
import { create } from "zustand";

interface BoardStoreState {
  filter: "all" | "owned" | "shared";
  setFilter: (filter: "all" | "owned" | "shared") => void;
}

export const useBoardStore = create<BoardStoreState>((set) => ({
  filter: "all",
  setFilter: (filter) => set({ filter }),
}));