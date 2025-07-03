import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const userData = authService.getCurrentUser();
      
      if (token && userData) {
        setUser(userData);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { token, usuario } = response;
      
      authService.saveAuthData(token, usuario);
      setUser(usuario);
      
      return { success: true, user: usuario };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { token, usuario } = response;
      
      authService.saveAuthData(token, usuario);
      setUser(usuario);
      
      return { success: true, user: usuario };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.mensaje || 'Error al registrarse' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
