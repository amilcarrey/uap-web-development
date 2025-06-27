import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Usuario, authService } from '../services/authService';
import api from '../services/api';

interface AuthContextType {
  usuario: Usuario | null;
  isAuthenticated: boolean;
  cargando: boolean;
  login: (email: string, contraseña: string) => Promise<void>;
  logout: () => Promise<void>;
  registro: (nombre: string, email: string, contraseña: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authService.obtenerPerfil();
        setUsuario(response.usuario);
      } catch (error) {
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };

    checkAuth();
  }, []); 

  const login = async (email: string, contraseña: string) => {
    try {
      const response = await authService.login({ email, contraseña });
      setUsuario(response.usuario);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setUsuario(null);
    }
  };

  const registro = async (nombre: string, email: string, contraseña: string) => {
    try {
      const response = await authService.registro({ nombre, email, contraseña });
      setUsuario(response.usuario);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    usuario,
    isAuthenticated: !!usuario,
    cargando,
    login,
    logout,
    registro,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
