import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConfigState = {
  refetchInterval: number;
  uppercaseDescriptions: boolean;
  setRefetchInterval: (value: number) => void;
  toggleUppercase: () => void;
};

export const useConfigStore = create(
  persist<ConfigState>(
    (set) => ({
      refetchInterval: 10000,
      uppercaseDescriptions: false,
      setRefetchInterval: (value) => set({ refetchInterval: value }),
      toggleUppercase: () =>
        set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
    }),
    {
      name: "config-store", // localStorage key
    }
  )
);
