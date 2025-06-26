import { create } from "zustand";
import { useEffect } from "react";
import axios from "axios";

// Leer configuración inicial desde localStorage (o usar valores por defecto)
const getInitialConfig = () => {
  try {
    const stored = localStorage.getItem("config");
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    intervaloRefetch: 10000,
    descripcionMayusculas: false,
    tareasPorPagina: 10,
    tareaBgColor: "#111827", // color por defecto
  };
};

type ConfigState = {
  intervaloRefetch: number;
  setIntervaloRefetch: (ms: number) => void;
  descripcionMayusculas: boolean;
  setDescripcionMayusculas: (val: boolean) => void;
  tareasPorPagina: number;
  setTareasPorPagina: (n: number) => void;
  tareaBgColor: string;
  setTareaBgColor: (color: string) => void;
  recibirConfigBackend: (data: any) => void; // <-- agrega esto
};

export const useConfigStore = create<ConfigState>((set, get) => ({
  ...getInitialConfig(),
  setIntervaloRefetch: (ms) => {
    const { descripcionMayusculas, tareasPorPagina, tareaBgColor } = get();
    set({ intervaloRefetch: ms });
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch: ms, descripcionMayusculas, tareasPorPagina, tareaBgColor })
    );
  },
  setDescripcionMayusculas: (val) => {
    const { intervaloRefetch, tareasPorPagina, tareaBgColor } = get();
    set({ descripcionMayusculas: val });
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch, descripcionMayusculas: val, tareasPorPagina, tareaBgColor })
    );
  },
  setTareasPorPagina: (n) => {
    const { intervaloRefetch, descripcionMayusculas, tareaBgColor } = get();
    set({ tareasPorPagina: n });
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch, descripcionMayusculas, tareasPorPagina: n, tareaBgColor })
    );
  },
  setTareaBgColor: (color) => {
    const { intervaloRefetch, descripcionMayusculas, tareasPorPagina } = get();
    set({ tareaBgColor: color });
    localStorage.setItem(
      "config",
      JSON.stringify({ intervaloRefetch, descripcionMayusculas, tareasPorPagina, tareaBgColor: color })
    );
  },
  // Nueva función para recibir configuración del backend
  recibirConfigBackend: (data) => {
    get().setIntervaloRefetch(data.intervalo_refetch ?? 10000);
    get().setTareasPorPagina(data.tareas_por_pagina ?? 3);
    get().setDescripcionMayusculas(!!data.descripcion_mayusculas);
    get().setTareaBgColor(data.tareaBgColor || data.tarea_bg_color || "#111827");
    useFondoStore.getState().setFondoUrl(data.fondoActual || ""); // <-- Añade esto

    // Y también actualiza localStorage:
    localStorage.setItem(
      "config",
      JSON.stringify({
        intervaloRefetch: data.intervalo_refetch ?? 10000,
        tareasPorPagina: data.tareas_por_pagina ?? 3,
        descripcionMayusculas: !!data.descripcion_mayusculas,
        tareaBgColor: data.tareaBgColor || data.tarea_bg_color || "#111827",
        fondoActual: data.fondoActual || "",
      })
    );
  },
}));

export function ConfigFetcher() {
  const recibirConfigBackend = useConfigStore((s) => s.recibirConfigBackend);

  useEffect(() => {
    axios.get("http://localhost:8008/api/config", { withCredentials: true })
      .then(res => {
        recibirConfigBackend(res.data); // <-- aquí sincronizas el store y localStorage
      })
      .catch(() => {});
  }, []);

  return null;
}

function setIntervaloRefetch(arg0: any) {
  throw new Error("Function not implemented.");
}
