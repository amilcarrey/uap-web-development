import { create } from "zustand";

export const useAuthStore = create<{
  isLoggedIn: boolean;
  nombre: string | null;
  setAuth: (isLoggedIn: boolean, nombre?: string | null) => void;
}>((set) => ({
  isLoggedIn: false,
  nombre: null,
  setAuth: (isLoggedIn, nombre = null) => set({ isLoggedIn, nombre }),
}));