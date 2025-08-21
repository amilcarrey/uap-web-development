import { create } from "zustand";
//El intervalo de refetch es una opción de configuración de React Query que permite que una (useQuery) se vuelva a ejecutar 
// automáticamente después de un período de tiempo definido. Esto es útil para:
//Actualizar datos en tiempo real.
//Sincronizar el estado del cliente con el servidor.

import { persist } from "zustand/middleware";

interface SettingsState {
  uppercaseDescriptions: boolean;
  toggleUppercaseDescriptions: () => void;
  refetchInterval: number;
  setRefetchInterval: (interval: number) => void;
}

export const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      uppercaseDescriptions: false, // Valor inicial
      toggleUppercaseDescriptions: () =>
        set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
      refetchInterval: 10, // Valor inicial en segundos
      setRefetchInterval: (interval) => set({ refetchInterval: interval }),
    }),
    {
      name: "settings-storage", // Nombre de la clave en localStorage
    }
  )
);