import { create } from 'zustand'

const useConfigStore = create((set) => ({
  refetchInterval: 10000,
  mayusculas: false,
  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  toggleMayusculas: () => set((state) => ({ mayusculas: !state.mayusculas })),
}))

export default useConfigStore
