import React from "react";
import { useAuthStore } from "../store/authStore";
import AuthPage from "../pages/AuthPage";
import LoadingSpinner from "./LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
