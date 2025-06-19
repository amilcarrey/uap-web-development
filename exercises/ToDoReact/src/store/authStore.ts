import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4322";

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,

        login: async (email: string, password: string) => {
          set({ isLoading: true });
          try {
            const response = await fetch(`${API_URL}/api/users/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || "Login failed");
            }

            const data = await response.json();
            const { user, token } = data.data;

            // Add a 3-second delay to show loading spinner
            await new Promise((resolve) => setTimeout(resolve, 3000));

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        register: async (username: string, email: string, password: string) => {
          set({ isLoading: true });
          try {
            const response = await fetch(`${API_URL}/api/users/register`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.error || "Registration failed");
            }

            const data = await response.json();
            const { user, token } = data.data;

            // Add a 3-second delay to show loading spinner
            await new Promise((resolve) => setTimeout(resolve, 3000));

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            set({ isLoading: false });
            throw error;
          }
        },

        logout: () => {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
        },

        setUser: (user: User) => set({ user }),
        setToken: (token: string) => set({ token }),
        clearAuth: () =>
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          }),
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "auth-store" }
  )
);
