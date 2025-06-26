import { create } from "zustand";
import { Task } from "../types";

interface TareaEnEdicionState {
  tarea: Task | null;
  setTarea: (t: Task) => void;
  cancelar: () => void;
}

export const useTareaEnEdicionStore = create<TareaEnEdicionState>((set) => ({
  tarea: null,
  setTarea: (t) => set({ tarea: t }),
  cancelar: () => set({ tarea: null }),
}));
