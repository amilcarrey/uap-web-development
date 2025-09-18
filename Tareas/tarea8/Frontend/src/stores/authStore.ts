import { create } from "zustand";
import { getUserFromToken, getUserFromJWTString } from "../utils/auth";
import { useConfigStore } from "./configStore";

interface AuthUser {
  id: number;
  alias: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (alias: string, password: string) => Promise<boolean>;
  register: (
    firstName: string,
    lastName: string,
    alias: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (alias: string, password: string) => {
    try {
      set({ isLoading: true });

      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ alias, password }),
      });

      if (res.ok) {
        const loginResponse = await res.json();

        if (loginResponse.user && loginResponse.user.user) {
          const userInfo = loginResponse.user.user;
          const token = loginResponse.user.token;

          let tokenData = null;
          if (token) {
            tokenData = getUserFromJWTString(token);
          }

          const userId = tokenData?.id || 5;

          localStorage.setItem("token", token);

          set({
            user: {
              id: userId,
              alias: userInfo.alias,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
            },
            isAuthenticated: true,
            isLoading: false,
          });

          useConfigStore.getState().setUserId(userId.toString());

          await new Promise((resolve) => setTimeout(resolve, 100));

          return true;
        } else {
          console.error("Estructura de respuesta inesperada:", loginResponse);
        }
      } else {
        console.error("Login falló con status:", res.status);
      }

      set({ isLoading: false });
      return false;
    } catch (error) {
      console.error("Error al hacer login:", error);
      set({ isLoading: false });
      return false;
    }
  },

  register: async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string
  ) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, alias, password }),
      });

      if (res.ok) {
        return await get().login(alias, password);
      }
      return false;
    } catch (error) {
      console.error("Error al registrarse:", error);
      return false;
    }
  },

  logout: async () => {
    try {
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      localStorage.removeItem("token");

      useConfigStore.getState().setUserId(null);

      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: () => {
    let userData = getUserFromToken();

    if (!userData) {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        userData = getUserFromJWTString(storedToken);
      }
    }

    if (userData) {
      const currentUser = get().user;
      set({
        user:
          currentUser && currentUser.firstName
            ? currentUser
            : {
                id: userData.id,
                alias: userData.alias,
              },
        isAuthenticated: true,
        isLoading: false,
      });

      useConfigStore.getState().setUserId(userData.id.toString());
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });

      useConfigStore.getState().setUserId(null);
    }
  },
}));
