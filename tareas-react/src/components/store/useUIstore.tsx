// store/useUIstore.ts
import { create } from "zustand";

type UIState = {
  filtro: "todas" | "activas" | "completadas";
  setFiltro: (filtro: UIState["filtro"]) => void;
  tableroActivo: string;
  setTableroActivo: (id: string) => void;
};

export const useUIStore = create<UIState>((set) => ({
  filtro: "todas",
  setFiltro: (filtro) => set({ filtro }),
  tableroActivo: "",
  setTableroActivo: (id) => set({ tableroActivo: id }),
}));
