// src/store/useTareasStore.ts
import { create } from "zustand";

type Filtro = "todas" | "activas" | "completadas";

interface TareasStore {
  filtro: Filtro;
  pagina: number;
  setFiltro: (nuevo: Filtro) => void;
  setPagina: (num: number) => void;
}

export const useTareasStore = create<TareasStore>((set) => ({
  filtro: "todas",
  pagina: 1,
  setFiltro: (nuevo) => set({ filtro: nuevo, pagina: 1 }),
  setPagina: (num) => set({ pagina: num }),
}));
