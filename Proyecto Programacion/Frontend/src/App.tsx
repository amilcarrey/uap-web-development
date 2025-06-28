// src\App.tsx

//import { useState } from 'react';
import { Toaster } from 'react-hot-toast'; // Componente para mostrar notificaciones emergentes
import { Header } from './components/Header';               // Encabezado principal de la aplicación
//import { TabsContainer } from './components/TabsContainer'; // Componente para mostrar las pestañas de categorías
//import { TabContent } from './components/TabContent';       // Componente que representa el contenido de cada pestaña
import { BoardManager } from './components/BoardManager';
import { Configuracion } from "./components/Configuracion";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthPage } from './components/AuthPage';
import {OpcionesNav} from './components/OpcionesNav'; // Componente para mostrar opciones de navegación
import { useEffect } from "react";
import { useAuthStore } from "./stores/authStore";
import { useTabs } from "./hooks/tabs";
import { useQueryClient } from '@tanstack/react-query';
import { UserSettings } from './components/UserSettings';
import { UserProfile } from './components/UserProfile'; // Agregar import
import { NotFound } from './components/ErrorBoundary';
import { FunctionalityDemo } from './components/FunctionalityDemo'; // Agregar demo
//import { AuthDebug } from './components/AuthDebug';

export default function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  const isHome = location.pathname === '/'; // Verifica si la ruta actual es la raíz (home)
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

  // Log para debugging
  /*
  useEffect(() => {
    console.log("Estado de autenticación:", { user, isAuthenticated, location: location.pathname });
  }, [user, isAuthenticated, location.pathname]);
  */
  // Encuentra el primer tablero si existe
  const firstBoardPath = tabs.length > 0 ? `/board/${encodeURIComponent(tabs[0].title)}` : "/board";

  // Si el usuario NO está autenticado y está en la raíz, muestra el login
  if (!isAuthenticated && location.pathname === "/") {
    return (
      <>
        <Toaster position="top-right" />
        <Header />
        <main style={{
          maxWidth: 600,
          margin: '20px auto',
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <AuthPage />
        </main>
      </>
    );
  }

  // Redirige solo si usuario autenticado, tableros listos y está en "/" Y hay tableros
  if (isAuthenticated && tabs.length > 0 && location.pathname === "/") {
    console.log("Redirigiendo a primer tablero:", firstBoardPath);
    return <Navigate to={firstBoardPath} replace />;
  }

  // Si el usuario está autenticado y no tiene tableros, muestra una pantalla de bienvenida o dashboard vacío
  if (isAuthenticated && tabs.length === 0 && location.pathname === "/") {
    return (
      <>
        <Toaster position="top-right" />
        <Header />
        <main style={{
          maxWidth: 600,
          margin: '20px auto',
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          {!isHome && <OpcionesNav />}
          <div className="text-center text-gray-600 py-10">
            ¡Bienvenido! Aún no tienes tableros. Usa el botón para crear tu primer tablero.
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* Encabezado de la aplicación (título, logo, etc.) */}
      <Toaster position="top-right" /> {/* Notificaciones emergentes */}
      {/* <AuthDebug /> */}
      <Header />
      {/* Contenedor principal con estilo centrado y tarjeta */}
      <main style={{
        maxWidth: 600,
        margin: '20px auto',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {!isHome && <OpcionesNav />}
        {/* Rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/board/:boardId" element={isAuthenticated ? <BoardManager /> : <Navigate to="/" replace />} />
          <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/" replace />} />
          <Route path="/settings" element={isAuthenticated ? <UserSettings /> : <Navigate to="/" replace />} />
          <Route path="/configuracion" element={isAuthenticated ? <Configuracion /> : <Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {/* Demo de funcionalidades */}
      <FunctionalityDemo />
    </>
  );
}


