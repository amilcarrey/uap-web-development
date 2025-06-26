import React, { type JSX } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import ConfigPage from "./ConfigPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./store";
import AuthBootstrap from "./AuthBootstrap";
// Componente para proteger rutas
function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isLogged = useUserStore(s => s.isLogged);
  const checkingAuth = useUserStore(s => s.checkingAuth);

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-500 text-xl">Verificando sesión...</span>
      </div>
    );
  }
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrap />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route path="/" element={<ProtectedRoute><Navigate to="/tablero/personal" /></ProtectedRoute>} />
          <Route path="/tablero/:boardId" element={<ProtectedRoute><App /></ProtectedRoute>} />
          <Route path="/configuracion" element={<ProtectedRoute><ConfigPage /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
