import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export function PrivateRoute({ children }: { children: JSX.Element }) {
  const { state } = useAuth();

  if (state.isLoading) return <p>Cargando...</p>;

  if (!state.user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
