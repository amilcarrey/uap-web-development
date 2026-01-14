import { create } from "zustand";
import { persist } from "zustand/middleware";
//El intervalo de refetch es una opción de configuración de React Query que permite que una (useQuery) se vuelva a ejecutar 
// automáticamente después de un período de tiempo definido. Esto es útil para:
//Actualizar datos en tiempo real.
//Sincronizar el estado del cliente con el servidor.

interface SettingsState {
  //configuraciones qisponibles guardadas en local storage
  uppercaseDescriptions: boolean;
  refetchInterval: number; // segundos
  tasksPerPage: number; // cantidad de tareas por página
  
  // acciones
  toggleUppercaseDescriptions: () => void;
  setRefetchInterval: (interval: number) => void;
  setTasksPerPage: (size: number) => void;
  
  // sync con el back
  syncWithBackend: (settings: any) => void;
  reset: () => void;
}

const defaultSettings = {
  uppercaseDescriptions: false,
  refetchInterval: 10, // 10 segundos
  tasksPerPage: 7, // tareas por defecto
};

export const useSettingsStore = create(
  persist<SettingsState>(
    (set) => ({
      ...defaultSettings,
      
      toggleUppercaseDescriptions: () =>
        set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
      
      setRefetchInterval: (interval) => set({ refetchInterval: interval }),
      
      setTasksPerPage: (size) => set({ tasksPerPage: size }),
      
      // sync desde el backend
      syncWithBackend: (settings) => set({
        uppercaseDescriptions: settings.uppercaseDescriptions === 'true',
        refetchInterval: parseInt(settings.refetchInterval) || defaultSettings.refetchInterval,
        tasksPerPage: parseInt(settings.tasksPerPage) || defaultSettings.tasksPerPage,
      }),
      
      reset: () => set(defaultSettings),
    }),
    {
      name: "settings-storage",
    }
  )
);