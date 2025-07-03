// src\App.tsx

import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { useTabs } from "./hooks/tabs";
import { useQueryClient } from '@tanstack/react-query';
import { BoardManager } from './components/boards/BoardManager';
import { NotFound } from './components/common/ErrorBoundary';
import { LoadingScreen, AuthScreen, AppLayout } from './components/layout/AppScreens';
import { WelcomeScreen } from './components/layout/WelcomeScreen';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const location = useLocation();
  const { data: tabs = [] } = useTabs();
  const queryClient = useQueryClient();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Forzar refetch de tableros cuando el usuario cambia (por ejemplo, tras login)
  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    }
  }, [user, queryClient]);

  // Estados de carga y autenticación
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no está autenticado y está en la raíz, mostrar login
  if (!isAuthenticated && location.pathname === "/") {
    return <AuthScreen />;
  }

  // Si está autenticado, tiene tableros y está en la raíz, redirigir al primer tablero
  if (isAuthenticated && tabs.length > 0 && location.pathname === "/") {
    const firstBoardPath = `/board/${encodeURIComponent(tabs[0].title)}`;
    return <Navigate to={firstBoardPath} replace />;
  }

  // Si está autenticado, no tiene tableros y está en la raíz, mostrar pantalla de bienvenida
  if (isAuthenticated && tabs.length === 0 && location.pathname === "/") {
    return (
      <AppLayout>
        <WelcomeScreen />
      </AppLayout>
    );
  }

  // Rutas principales de la aplicación
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/board/:boardId" element={isAuthenticated ? <BoardManager /> : <Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}


