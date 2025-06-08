import { create } from 'zustand';

interface SettingsState {
  refetchInterval: number;
  uppercaseDescriptions: boolean;
  setRefetchInterval: (ms: number) => void;
  toggleUppercaseDescriptions: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  refetchInterval: 10000,
  uppercaseDescriptions: false,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  toggleUppercaseDescriptions: () =>
    set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
}));
