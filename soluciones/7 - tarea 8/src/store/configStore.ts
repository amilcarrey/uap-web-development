import { create } from "zustand";

// Estado global para configuración de la app (intervalo de refetch y modo mayúsculas)
interface ConfigState {
  refetchInterval: number;
  descripcionMayuscula: boolean;
  setRefetchInterval: (interval: number) => void;
  setDescripcionMayuscula: (valor: boolean) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  // Intervalo de actualización automática de tareas (en milisegundos)
  refetchInterval: 10000,
  // Si las descripciones de tareas se muestran en mayúsculas
  descripcionMayuscula: false,
  // Setter para cambiar el intervalo
  setRefetchInterval: (interval) => set({ refetchInterval: interval }),
  // Setter para cambiar el modo mayúsculas
  setDescripcionMayuscula: (valor) => set({ descripcionMayuscula: valor }),
}));
