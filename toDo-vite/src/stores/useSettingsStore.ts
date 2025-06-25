// src/stores/useSettingsStore.ts
import { create } from 'zustand';

type SettingsState = {
  refetchInterval: number;
  uppercaseDescriptions: boolean;
   tasksPerPage: number; 
  setRefetchInterval: (interval: number) => void;
  toggleUppercaseDescriptions: () => void;
  setTasksPerPage: (n: number) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  refetchInterval: 10000,
  uppercaseDescriptions: false,
  tasksPerPage: 5,
  setTasksPerPage: (n: number) => set({ tasksPerPage: n }),
  setRefetchInterval: (interval) => set({ refetchInterval: interval }),
  toggleUppercaseDescriptions: () =>
    set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
}));
