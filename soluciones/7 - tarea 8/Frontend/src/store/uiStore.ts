import { create } from "zustand";
import type { Tarea } from "../types";

// Store global para manejar el estado de UI (ejemplo: tarea actualmente en edición)
interface UIState {
  tareaEditando: Tarea | null;
  setTareaEditando: (t: Tarea | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  tareaEditando: null,
  setTareaEditando: (t) => set({ tareaEditando: t }),
}));
