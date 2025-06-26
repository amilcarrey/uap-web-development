import { create } from 'zustand'

export const useUIStore = create((set) => ({
  config: {
    refetchInterval: 10000,
    uppercase: false
  },
  setRefetchInterval: (ms) =>
    set((state) => ({
      config: { ...state.config, refetchInterval: ms }
    })),
  toggleUppercase: () =>
    set((state) => ({
      config: { ...state.config, uppercase: !state.config.uppercase }
    }))
}))

