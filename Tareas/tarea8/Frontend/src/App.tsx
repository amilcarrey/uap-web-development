import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { BoardManager } from './components/BoardManager';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthPage } from './components/AuthPage';
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { useTabs, useCreateTab } from "./hooks/tabs";
import { useQueryClient } from '@tanstack/react-query';
import { NotFound } from './components/ErrorBoundary';
import toast from 'react-hot-toast';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const location = useLocation();
  const { data: tabs = [] } = useTabs();
  const queryClient = useQueryClient();
  const createTab = useCreateTab();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ['tabs'] });
    }
  }, [user, queryClient]);

  const firstBoardPath = tabs.length > 0 ? `/board/${encodeURIComponent(tabs[0].title)}` : "/board";

  const containerStyles = {
    maxWidth: 1200,
    margin: '3px auto',
    padding: 24,
    backgroundColor: '#c7e7d6',
    minHeight: 600
  };

  if (isLoading) {
    return (
      <>
        <Toaster position="bottom-left" />
        <Header />
        <main style={containerStyles}>
          <div className="text-center text-orange-700 py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
            🔐 Comprobando sesión...
          </div>
        </main>
      </>
    );
  }

  if (!isAuthenticated && location.pathname === "/") {
    return (
      <>
        <Toaster position="bottom-left" />
        <Header />
        <main style={containerStyles}>
          <AuthPage />
        </main>
      </>
    );
  }

  if (isAuthenticated && tabs.length > 0 && location.pathname === "/") {
    console.log("Redirigiendo a primer tablero:", firstBoardPath);
    return <Navigate to={firstBoardPath} replace />;
  }

  if (isAuthenticated && tabs.length === 0 && location.pathname === "/") {
    return (
      <>
        <Toaster position="bottom-left" />
        <Header />
        <main style={containerStyles}>
          <div className="text-center text-orange-700 py-12">
            🎉 <strong>¡Hola!</strong> Aún no tenés tableros creados.
            <div className="mt-6">
              <button
                onClick={() => {
                  const title = `Tablero 1`;
                  createTab.mutate(title, {
                    onSuccess: (newTab) => {
                      try {
                        toast.success("✅ Tablero listo");
                        window.location.href = `/board/${encodeURIComponent(newTab.title)}`;
                      } catch (error) {
                        console.error('⚠️ Error al redirigir tras crear tablero:', error);
                        toast.error("Se creó el tablero pero no se pudo abrir");
                      }
                    },
                    onError: (error) => {
                      console.error('🚫 Error creando el tablero:', error);
                      toast.error(`No se pudo crear: ${error.message}`);
                    }
                  });
                }}
                disabled={createTab.isPending}
                className="px-6 py-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createTab.isPending ? 'Creando...' : '➕ Crear mi primer tablero'}
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Toaster position="bottom-left" />
      <Header />
      <main style={containerStyles}>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/board/:boardId" element={isAuthenticated ? <BoardManager /> : <Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
