import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      refetchInterval: 10, // segundos
      showUppercase: false,
      setRefetchInterval: (interval) => set({ refetchInterval: interval }),
      setShowUppercase: (value) => set({ showUppercase: value }),
    }),
    {
      name: 'todo-settings',
    }
  )
) 