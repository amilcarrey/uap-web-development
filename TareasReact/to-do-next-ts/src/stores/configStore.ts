import { create } from 'zustand';

type ConfigState = {
  refetchInterval: number;
  mayusculas: boolean;
  setRefetchInterval: (value: number) => void;
  setMayusculas: (value: boolean) => void;
};

export const useConfigStore = create<ConfigState>((set) => ({
  refetchInterval: 10000,
  mayusculas: false,
  setRefetchInterval: (value) => set({ refetchInterval: value }),
  setMayusculas: (value) => set({ mayusculas: value }),
}));
