// src/store/configStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConfigState = {
  refetchInterval: number;
  uppercaseDescriptions: boolean;
  taskPageSize: number; // ← Agregar aquí
  setRefetchInterval: (value: number) => void;
  toggleUppercase: () => void;
  setTaskPageSize: (limit: number) => void; // ← Agregar aquí
};

export const useConfigStore = create(
  persist<ConfigState>(
    (set) => ({
      refetchInterval: 10000,
      uppercaseDescriptions: false,
      taskPageSize: 10, // ← Agregar aquí
  
      setRefetchInterval: (value) => set({ refetchInterval: value }),
      toggleUppercase: () =>
        set((state) => ({ uppercaseDescriptions: !state.uppercaseDescriptions })),
      setTaskPageSize: (limit) => set({ taskPageSize: limit }), // ← Agregar aquí
    }),
    {
      name: "config-store", // localStorage key
    }
  )
);