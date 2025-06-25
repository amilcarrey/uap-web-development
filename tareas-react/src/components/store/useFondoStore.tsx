import { create } from "zustand";

interface FondoState {
  fondoUrl: string | null;
  setFondoUrl: (url: string) => void;
}

const initialUrl = localStorage.getItem("fondoUrl") || "";

export const useFondoStore = create<FondoState>((set) => ({
  fondoUrl: initialUrl,
  setFondoUrl: (url) => {
    set({ fondoUrl: url });
    localStorage.setItem("fondoUrl", url);
  },
}));