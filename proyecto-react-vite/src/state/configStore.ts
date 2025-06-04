import { create } from 'zustand';

type ConfigState = {
  refetchInterval: number;
  mayusculas: boolean;
  setRefetchInterval: (ms: number) => void;
  toggleMayusculas: () => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  refetchInterval: 10000,
  mayusculas: false,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  toggleMayusculas: () =>
    set((state) => ({ mayusculas: !state.mayusculas })),
}));
