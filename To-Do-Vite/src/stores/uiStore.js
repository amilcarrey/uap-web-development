import { create } from 'zustand';

const useUIStore = create((set) => ({
  showModal: false,
  setShowModal: (show) => set({ showModal: show }),
  notification: null,
  setNotification: (notification) => set({ notification }),
  clearNotification: () => set({ notification: null }),
}));

export default useUIStore; 