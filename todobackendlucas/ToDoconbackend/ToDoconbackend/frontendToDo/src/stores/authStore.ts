import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  nombre: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user: User, token: string) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        set({ user });
      },
      initializeAuth: () => {
        const token = localStorage.getItem('authToken');
        const userString = localStorage.getItem('currentUser');
        
        if (token && userString) {
          try {
            const user = JSON.parse(userString);
            set({ user, token, isAuthenticated: true });
          } catch (error) {
            console.error('Error parsing user data:', error);
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
