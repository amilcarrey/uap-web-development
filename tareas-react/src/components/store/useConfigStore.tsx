import { create } from "zustand";

// Leer configuración inicial desde localStorage (o usar valores por defecto)
const getInitialConfig = () => {
  try {
    const stored = localStorage.getItem("config");
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    intervaloRefetch: 10000,
    descripcionMayusculas: false,
  };
};

type ConfigState = {
  intervaloRefetch: number;
  setIntervaloRefetch: (ms: number) => void;
  descripcionMayusculas: boolean;
  setDescripcionMayusculas: (val: boolean) => void;
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  ...getInitialConfig(),
  setIntervaloRefetch: (ms) => {
    set({ intervaloRefetch: ms });
    const { descripcionMayusculas } = get();
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch: ms, descripcionMayusculas })
    );
  },
  setDescripcionMayusculas: (val) => {
    set({ descripcionMayusculas: val });
    const { intervaloRefetch } = get();
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch, descripcionMayusculas: val })
    );
  },
}));