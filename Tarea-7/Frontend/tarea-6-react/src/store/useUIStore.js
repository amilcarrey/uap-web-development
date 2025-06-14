import { create } from 'zustand';

export const useUIStore = create((set) => ({
  filter: 'all',
  setFilter: (filter) => set({ filter }),
}));
