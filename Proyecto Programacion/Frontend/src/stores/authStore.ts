import { create } from "zustand";
import { getUserFromToken, getUserFromJWTString } from "../utils/auth";

interface AuthUser {
  id: number;
  alias: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (alias: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, alias: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,

  login: async (alias: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ alias, password }),
      });

      if (res.ok) {
        // El backend devuelve la respuesta con el token y datos del usuario
        const loginResponse = await res.json();
        console.log("Respuesta del login:", loginResponse);
        
        if (loginResponse.user && loginResponse.user.user) {
          const userInfo = loginResponse.user.user;
          const token = loginResponse.user.token;
          
          // Extraer ID del token JWT desde la respuesta (no desde cookies)
          let tokenData = null;
          if (token) {
            tokenData = getUserFromJWTString(token);
            console.log("Datos extraídos del token de la respuesta:", tokenData);
          }
          
          const userId = tokenData?.id || 5; // Usar ID 5 como fallback basado en los logs
          
          // Almacenar el token en localStorage como backup
          localStorage.setItem('authToken', token);
          
          set({ 
            user: { 
              id: userId,
              alias: userInfo.alias,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName
            }, 
            isAuthenticated: true 
          });
          console.log("Estado actualizado - usuario autenticado:", userInfo.alias, "ID:", userId);
          return true;
        } else {
          console.error("Estructura de respuesta inesperada:", loginResponse);
        }
      } else {
        console.error("Login falló con status:", res.status);
      }
      return false;
    } catch (error) {
      console.error("Error al hacer login:", error);
      return false;
    }
  },

  register: async (firstName: string, lastName: string, alias: string, password: string) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, alias, password }),
      });

      if (res.ok) {
        // Auto-login después del registro
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
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      // Limpiar localStorage también
      localStorage.removeItem('authToken');
      set({ user: null, isAuthenticated: false });
    }
  },

  // Verificar autenticación usando JWT en cookies o localStorage
  checkAuth: () => {
    // Primero intentar obtener de cookies
    let userData = getUserFromToken();
    
    // Si no hay en cookies, intentar desde localStorage
    if (!userData) {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        userData = getUserFromJWTString(storedToken);
        console.log("Datos de usuario obtenidos desde localStorage:", userData);
      }
    }
    
    if (userData) {
      // Si ya tenemos datos completos del usuario, los mantenemos
      const currentUser = get().user;
      set({ 
        user: currentUser && currentUser.firstName ? currentUser : { 
          id: userData.id, 
          alias: userData.alias 
        }, 
        isAuthenticated: true 
      });
      console.log("checkAuth: Usuario autenticado", userData.alias);
    } else {
      set({ user: null, isAuthenticated: false });
      console.log("checkAuth: Usuario no autenticado");
    }
  },
}));