import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import { BoardsList } from "../components/boards/BoardsList";
import { BoardDetail } from "../components/boards/BoardDetail";
import { UserSettings } from "../components/config/UserSettings";

export const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const PublicRoute = ({ children }: { children: React.ReactElement }) => {
    return user ? <Navigate to="/boards" /> : children;
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginForm />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterForm />
          </PublicRoute>
        }
      />

      {/* Rutas privadas */}
      <Route
        path="/boards"
        element={
          <PrivateRoute>
            <BoardsList />
          </PrivateRoute>
        }
      />
      <Route
        path="/boards/:boardId"
        element={
          <PrivateRoute>
            <BoardDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <UserSettings />
          </PrivateRoute>
        }
      />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to={user ? "/boards" : "/login"} />} />
    </Routes>
  );
};
