import { create } from "zustand";

interface ConfiguracionState {
  intervaloRefetch: number; // en milisegundos
  descripcionMayusculas: boolean;
  setIntervaloRefetch: (valor: number) => void;
  setDescripcionMayusculas: (valor: boolean) => void;
}

export const useConfiguracionStore = create<ConfiguracionState>((set) => ({
  intervaloRefetch: 10000,
  descripcionMayusculas: false,
  setIntervaloRefetch: (valor) => set({ intervaloRefetch: valor }),
  setDescripcionMayusculas: (valor) => set({ descripcionMayusculas: valor }),
}));
