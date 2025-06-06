// src/stores/settingsStore.js
import { create } from 'zustand';

export const useSettingsStore = create((set) => ({
  refetchInterval: 10,
  uppercase: false,
  setRefetchInterval: (seconds) => set({ refetchInterval: seconds }),
  toggleUppercase: () => set((state) => ({ uppercase: !state.uppercase })),
}));
