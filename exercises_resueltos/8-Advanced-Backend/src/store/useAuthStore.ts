import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the shape of the User object we expect from the backend (excluding sensitive info)
interface User {
  id: number;
  username: string;
  email: string;
  // Add any other non-sensitive fields you expect, e.g., createdAt
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // To handle loading state during auth checks
  error: string | null; // To store any auth-related errors
  login: (userData: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (userData: User | null) => void; // For initial auth check
}

export const useAuthStore = create<AuthState>()(
  // Persist only a subset of the state if needed, e.g., not error or isLoading.
  // However, for user and isAuthenticated, session/cookie is the source of truth.
  // Persisting here can help with immediate UI updates on refresh before async check completes.
  // For this setup, backend cookie is primary. This store reflects cookie state.
  // We won't persist directly to localStorage for user/isAuthenticated to rely on HTTP-only cookie.
  // isLoading and error are transient.
  (set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: true, // Start with loading true for initial auth check
    error: null,
    login: (userData) => set({ isAuthenticated: true, user: userData, error: null, isLoading: false }),
    logout: () => set({ isAuthenticated: false, user: null, error: null, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error, isLoading: false }),
    setUser: (userData) => set({ user: userData, isAuthenticated: !!userData, isLoading: false }),
  }),
  // { // Example of persisting state if needed, but not recommended for JWT in HttpOnly cookie scenario
  //   name: 'auth-storage', // unique name
  //   storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  //   partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
  // }
);

// Selector hooks (optional but good practice)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useAuthIsLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
