// src/stores/useSettingsStore.ts
import { create } from 'zustand';

type SettingsState = {
  refetchInterval: number;
  uppercaseDescriptions: boolean;
  setRefetchInterval: (interval: number) => void;
  toggleUppercaseDescriptions: () => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  refetchInterval: 10000,
  uppercaseDescriptions: false,
  setRefetchInterval: (interval) => set({ refetchInterval: interval }),
  toggleUppercaseDescriptions: () =>
    set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
}));
