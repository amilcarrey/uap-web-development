
import { create } from 'zustand';

interface PaginacionState {
  pagina: number;
  setPagina: (nueva: number) => void;
  resetPagina: () => void;
}

export const usePaginacionStore = create<PaginacionState>((set) => ({
  pagina: 1,
  setPagina: (nueva) => set({ pagina: nueva }),
  resetPagina: () => set({ pagina: 1 }),
}));
