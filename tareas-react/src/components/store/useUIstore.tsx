import { create } from "zustand";

type Filtro = "todas" | "activas" | "completadas";

interface UIState {
  filtro: Filtro;
  setFiltro: (filtro: Filtro) => void;

  pagina: number;
  setPagina: (pagina: number) => void;

  tableroActivo: string;
  setTableroActivo: (id: string) => void;

  tableros: string[];
  agregarTablero: (nombre: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  filtro: "todas",
  pagina: 1,
  tableroActivo: "Personal",
  tableros: ["Personal", "Trabajo"],

  setFiltro: (filtro) => set(() => ({ filtro, pagina: 1 })),
  setPagina: (pagina) => set(() => ({ pagina })),
  setTableroActivo: (id) => set(() => ({ tableroActivo: id, pagina: 1 })),
  agregarTablero: (nombre) =>
    set((state) => ({
      tableros: [...state.tableros, nombre],
      tableroActivo: nombre,
      pagina: 1,
    })),
}));
