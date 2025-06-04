//src\stores\configStore.ts

import { create } from 'zustand';

interface ConfigState{
  refetchInterval: number;
  setRefetchInterval: (interval: number) => void;
  upperCaseDescription: boolean;
  setUpperCaseDescription: (value: boolean) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  refetchInterval: 10000, // Intervalo de refetch por defecto (10 segundos)
  setRefetchInterval: (interval) => set({ refetchInterval: interval }),
  upperCaseDescription: false, // Por defecto no se usa mayúsculas en la descripción
  setUpperCaseDescription: (value) => set({ upperCaseDescription: value }),
}));