// src/store/useAuthStore.js
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  usuario: null,
  setUsuario: (usuario) => set({ usuario }),
}));
