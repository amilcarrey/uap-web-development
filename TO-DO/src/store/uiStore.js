import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isModalOpen: false,
  toggleModal: () => set((state) => ({ isModalOpen: !state.isModalOpen })),
  notification: null,
  showNotification: (msg) => set({ notification: msg }),
  clearNotification: () => set({ notification: null }),
}));
