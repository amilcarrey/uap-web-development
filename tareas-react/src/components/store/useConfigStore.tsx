import { create } from "zustand";

type ConfigState = {
  intervaloRefetch: number; // en ms
  setIntervaloRefetch: (ms: number) => void;
  descripcionMayusculas: boolean;
  setDescripcionMayusculas: (val: boolean) => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  intervaloRefetch: 10000,
  setIntervaloRefetch: (ms) => set({ intervaloRefetch: ms }),
  descripcionMayusculas: false,
  setDescripcionMayusculas: (val) => set({ descripcionMayusculas: val }),
}));