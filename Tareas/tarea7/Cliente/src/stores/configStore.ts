import { create } from 'zustand';

interface ConfigState{
  refetchInterval: number;
  setRefetchInterval: (interval: number) => void;
  upperCaseDescription: boolean;
  setUpperCaseDescription: (value: boolean) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  refetchInterval: 10000,
  setRefetchInterval: (interval) => set({ refetchInterval: interval }),
  upperCaseDescription: false,
  setUpperCaseDescription: (value) => set({ upperCaseDescription: value }),
}));