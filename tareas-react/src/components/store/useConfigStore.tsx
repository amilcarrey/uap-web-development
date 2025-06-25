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
    tareasPorPagina: 10, // Valor por defecto
  };
};

type ConfigState = {
  intervaloRefetch: number;
  setIntervaloRefetch: (ms: number) => void;
  descripcionMayusculas: boolean;
  setDescripcionMayusculas: (val: boolean) => void;
  tareasPorPagina: number;
  setTareasPorPagina: (n: number) => void;
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  ...getInitialConfig(),
  setIntervaloRefetch: (ms) => {
    set({ intervaloRefetch: ms });
    const { descripcionMayusculas, tareasPorPagina } = get();
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch: ms, descripcionMayusculas, tareasPorPagina })
    );
  },
  setDescripcionMayusculas: (val) => {
    set({ descripcionMayusculas: val });
    const { intervaloRefetch, tareasPorPagina } = get();
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch, descripcionMayusculas: val, tareasPorPagina })
    );
  },
  setTareasPorPagina: (n) => {
    set({ tareasPorPagina: n });
    const { intervaloRefetch, descripcionMayusculas } = get();
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch, descripcionMayusculas, tareasPorPagina: n })
    );
  },
}));