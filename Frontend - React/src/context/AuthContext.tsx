import React, { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  isAuthenticated: boolean;          // Estado para saber si hay token válido
  token: string | null;              // Token JWT u otro token de sesión
  userId: number | null;             // ID del usuario logueado
  login: (token: string, userId: number) => void;  // Función para iniciar sesión
  logout: () => void;                // Función para cerrar sesión
  loading: boolean;                  // Estado para indicar que se está cargando 
};

// Crear contexto con valor inicial indefinido para forzar el hook a usarlo dentro del provider
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estados para token y userId
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  // Estado para controlar la carga inicial 
  const [loading, setLoading] = useState(true);

  // useEffect que se ejecuta al montar para cargar credenciales guardadas
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    setToken(storedToken);
    setUserId(storedUserId ? parseInt(storedUserId) : null);
    setLoading(false);
  }, []);

  // Función para iniciar sesión: guarda en localStorage y en estado
  const login = (newToken: string, newUserId: number) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("userId", newUserId.toString());
    setToken(newToken);
    setUserId(newUserId);
  };

  // Función para cerrar sesión: borra localStorage y limpia estados
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUserId(null);
  };

  // Determinar si está autenticado basado en la existencia de token
  const isAuthenticated = !!token;

  // Proveer los valores del contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ isAuthenticated, token, userId, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
