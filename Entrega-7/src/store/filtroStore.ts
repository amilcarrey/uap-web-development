import { create } from "zustand";

type Filtro = "todas" | "completadas" | "incompletas";

interface FiltroState {
  filtro: Filtro;
  setFiltro: (nuevo: Filtro) => void;
}

export const useFiltroStore = create<FiltroState>((set) => ({
  filtro: "todas",
  setFiltro: (nuevo) => set({ filtro: nuevo }),
}));
