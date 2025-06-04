import { create } from "zustand";

type Filtro = "todas" | "activas" | "completadas";

interface UIState {
  pagina: number;
  filtro: Filtro;
  tableros: string[];
  tableroActivo: string;
  setPagina: (pagina: number) => void;
  setFiltro: (filtro: Filtro) => void;
  agregarTablero: (nombre: string) => void;
  setTableroActivo: (nombre: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  pagina: 1,
  filtro: "todas",
  tableros: ["Personal", "Trabajo"],
  tableroActivo: "Personal",
  setPagina: (pagina) => set({ pagina }),
  setFiltro: (filtro) => set({ filtro, pagina: 1 }),
  agregarTablero: (nombre) =>
    set((state) => ({
      tableros: [...state.tableros, nombre],
      tableroActivo: nombre,
      pagina: 1,
    })),
  setTableroActivo: (nombre) => set({ tableroActivo: nombre, pagina: 1 }),
}));