import { create } from 'zustand';

type ConfigState = {
  refetchInterval: number;
  uppercase: boolean;
  setRefetchInterval: (ms: number) => void;
  toggleUppercase: () => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  refetchInterval: 10000,
  uppercase: false,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  toggleUppercase: () => set((s) => ({ uppercase: !s.uppercase })),
}));
