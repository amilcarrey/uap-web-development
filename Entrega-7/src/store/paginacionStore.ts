// src/store/paginacionStore.ts
import { create } from "zustand";

interface PaginacionState {
  paginaActual: number;
  siguientePagina: () => void;
  paginaAnterior: () => void;
  setPagina: (nueva: number) => void;
}

export const usePaginacionStore = create<PaginacionState>((set) => ({
  paginaActual: 1,
  siguientePagina: () => set((state) => ({ paginaActual: state.paginaActual + 1 })),
  paginaAnterior: () => set((state) => ({
    paginaActual: state.paginaActual > 1 ? state.paginaActual - 1 : 1
  })),
  setPagina: (nueva) => set({ paginaActual: nueva }),
}));
