// src/store/configuracionStore.ts
import { create } from "zustand";

interface ConfiguracionState {
  refreshInterval: number;
  capitalizeTasks: boolean;
  setRefreshInterval: (ms: number) => void;
  setCapitalizeTasks: (value: boolean) => void;
}

export const useConfiguracionStore = create<ConfiguracionState>((set) => ({
  refreshInterval: 60000,
  capitalizeTasks: false,
  setRefreshInterval: (ms) => set({ refreshInterval: ms }),
  setCapitalizeTasks: (value) => set({ capitalizeTasks: value }),
}));
