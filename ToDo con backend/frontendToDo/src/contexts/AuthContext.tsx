import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "../api";
import toast from "react-hot-toast";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Verificar si hay un usuario autenticado al cargar la app
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get("/api/users/me");
      setUser(response.data.user);
    } catch (error) {
      // No hay usuario autenticado
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/users/login", { email, password });
      setUser(response.data.user);
      toast.success("Sesión iniciada correctamente");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al iniciar sesión";
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await api.post("/api/users/register", {
        username,
        email,
        password,
      });
      setUser(response.data.user);
      toast.success("Usuario registrado correctamente");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al registrarse";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/users/logout");
      setUser(null);
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      // Incluso si falla la petición, limpiar el estado local
      setUser(null);
      toast.success("Sesión cerrada");
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
