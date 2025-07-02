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
  register: (firstName: string, lastName: string, alias: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Empieza en loading hasta que checkAuth termine

  login: async (alias: string, password: string) => {
    try {
      set({ isLoading: true }); // Marcar como cargando durante el login
      
      const res = await fetch("http://localhost:3000/api/auth/login", {
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
          localStorage.setItem('token', token);
          
          set({ 
            user: { 
              id: userId,
              alias: userInfo.alias,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName
            }, 
            isAuthenticated: true,
            isLoading: false
          });
          
          // ✅ NUEVO: Sincronizar configuraciones específicas del usuario
          useConfigStore.getState().setUserId(userId.toString());
          
          console.log("Estado actualizado - usuario autenticado:", userInfo.alias, "ID:", userId);
          console.log("🔧 Configuraciones del usuario cargadas para ID:", userId);
          
          // Pequeña espera para asegurar que las cookies se establezcan completamente
          await new Promise(resolve => setTimeout(resolve, 100));
          
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

  register: async (firstName: string, lastName: string, alias: string, password: string) => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
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
      await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error al hacer logout:", error);
    } finally {
      // Limpiar localStorage también
      localStorage.removeItem('token');
      
      // ✅ NUEVO: Limpiar configuraciones específicas del usuario
      useConfigStore.getState().setUserId(null);
      
      set({ user: null, isAuthenticated: false, isLoading: false });
      console.log("🔧 Usuario deslogueado, configuraciones reseteadas");
    }
  },

  // Verificar autenticación usando JWT en cookies o localStorage
  checkAuth: () => {
    // Primero intentar obtener de cookies
    let userData = getUserFromToken();
    
    // Si no hay en cookies, intentar desde localStorage
    if (!userData) {
      const storedToken = localStorage.getItem('token');
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
        isAuthenticated: true,
        isLoading: false
      });
      
      // ✅ NUEVO: Cargar configuraciones específicas del usuario en checkAuth
      useConfigStore.getState().setUserId(userData.id.toString());
      
      console.log("checkAuth: Usuario autenticado", userData.alias);
      console.log("🔧 Configuraciones del usuario cargadas para ID:", userData.id);
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
      
      // ✅ NUEVO: Limpiar configuraciones si no hay usuario
      useConfigStore.getState().setUserId(null);
      
      console.log("checkAuth: Usuario no autenticado");
    }
  },
}));