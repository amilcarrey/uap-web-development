import { create } from 'zustand';

interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (userData) => set({ user: userData }),
  logout: () => {
    //borrar cookie en frontend no es suficiente para seguridad, pero ayuda a sincronizar estado
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    set({ user: null });
  },
}));
