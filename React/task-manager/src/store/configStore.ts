import { create } from "zustand";

type ConfigState = {
  board: string;
  setBoard: (nuevoBoard: string) => void;

  refetchInterval: number;
  setRefetchInterval: (ms: number) => void;

  mayusculas: boolean;
  setMayusculas: (v: boolean) => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  // Tablero actual seleccionado
  board: "default",
  setBoard: (nuevoBoard) => set({ board: nuevoBoard }),

  // Intervalo de actualización automática (en milisegundos)
  refetchInterval: 10000,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),

  // Mostrar descripciones en mayúsculas
  mayusculas: false,
  setMayusculas: (v) => set({ mayusculas: v }),
  
}));
