// src/store/useTareaEnEdicionStore.ts
import { create } from "zustand";
import { Tarea } from "../types";

interface TareaEnEdicionState {
  tarea: Tarea | null;
  setTarea: (t: Tarea) => void;
  cancelar: () => void;
}

export const useTareaEnEdicionStore = create<TareaEnEdicionState>((set) => ({
  tarea: null,
  setTarea: (t) => set({ tarea: t }),
  cancelar: () => set({ tarea: null }),
}));
