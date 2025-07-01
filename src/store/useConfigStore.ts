import { create } from "zustand";

interface ConfigState {
  refetchInterval: number;
  uppercaseDescriptions: boolean;
  setRefetchInterval: (ms: number) => void;
  setUppercaseDescriptions: (v: boolean) => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  refetchInterval: 10000,
  uppercaseDescriptions: false,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  setUppercaseDescriptions: (v) => set({ uppercaseDescriptions: v }),
}));
