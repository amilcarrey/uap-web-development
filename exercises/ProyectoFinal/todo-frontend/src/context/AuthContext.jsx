import React, { createContext, useState, useEffect } from 'react';
import { api } from '../api/axios';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Al montar comprobamos si ya hay sesión
  useEffect(() => {
    api.get('/protected')
       .then(res => {
         const id = res.data.message.split(' ')[2];
         setUser({ id });
       })
       .catch(() => setUser(null));
  }, []);

  const register = (email, password) =>
    api.post('/auth/register', { email, password });

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    const res = await api.get('/protected');
    const id  = res.data.message.split(' ')[2];
    setUser({ id });
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
