import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface AppConfig {
  taskRefetchInterval: number;
  uppercaseDescriptions: boolean;
}

interface ConfigState {
  config: AppConfig;
  setConfig: (config: Partial<AppConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: AppConfig = {
  taskRefetchInterval: 10,
  uppercaseDescriptions: false,
};

export const useConfigStore = create<ConfigState>()(
  devtools(
    persist(
      (set) => ({
        config: defaultConfig,

        setConfig: (newConfig) =>
          set((state) => ({
            config: { ...state.config, ...newConfig },
          })),

        resetConfig: () => set({ config: defaultConfig }),
      }),
      {
        name: "app-config", // nombre para localStorage
      }
    ),
    { name: "config-store" }
  )
);
