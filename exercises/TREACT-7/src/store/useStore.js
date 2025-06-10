
import { create } from 'zustand';

export const useSettings = create((set) => ({
  // Estado global: intervalo de refetch y uppercase
  refetchInterval: 10000, // 10 segundos por defecto
  uppercase: false,

  setRefetchInterval: (ms) => set({ refetchInterval: ms }),
  toggleUppercase: () => set((state) => ({ uppercase: !state.uppercase })),
}));
