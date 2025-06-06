import { create } from "zustand"

interface ConfigStore {
  refetchInterval: number
  uppercase: boolean
  setRefetchInterval: (ms: number) => void
  toggleUppercase: () => void
}

export const useSettingsStore = create<ConfigStore>((set) => ({
  refetchInterval: 10000,
  uppercase: false,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  toggleUppercase: () => set((state) => ({ uppercase: !state.uppercase })),
}))
