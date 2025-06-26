//import { useEffect, useState } from "react";
import AuthPage from "./Auth";
import Home from "../pages/Home";
//import { useAuthStore } from "../store/authStore";
import { useAuth } from "../hooks/useAuth";

export function Index() {
  
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-pink-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Home /> : <AuthPage />;

}
