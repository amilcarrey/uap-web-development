import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: { id: number; username: string } | null;
  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>(() => ({
  isAuthenticated: true,
  user: { id: 1, username: "benjamon" }, // ← HARDCODEADO
  setAuthenticated: () => {}, // No hacer nada
}));