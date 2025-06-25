import { create } from "zustand";

interface User {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

//const API_URL = "http://localhost:4321/api";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  checkAuth: async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/auth/me`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user });
      } else {
        set({ user: null });
      }
    } catch {
      set({ user: null });
    }
  },
  logout: async () => {
    await fetch(`http://localhost:3000/api/auth/logout`, { method: "POST", credentials: "include" });
    set({ user: null });
  },
}));