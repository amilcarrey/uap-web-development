import { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';

export const AuthInitializer = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return null;
};
