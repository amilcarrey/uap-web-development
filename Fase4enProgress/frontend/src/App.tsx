import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Tablero from "./pages/Tablero";
import Home from "./pages/Home";
import AdminTableros from "./pages/AdminTableros";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import { useAuthStore } from "./store/authStore";
import { useCurrentUser } from "./hooks/useCurrentUser";

const App = () => {
  const { data: user, isSuccess, isLoading } = useCurrentUser();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (isSuccess && user) login(user);
  }, [isSuccess, user, login]);

  if (isLoading) return <p className="text-center">Cargando...</p>;

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tablero/:tableroId" element={<Tablero />} />
          <Route path="admin" element={<AdminTableros />} />
          <Route path="configuracion" element={<ConfiguracionPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      )}
    </Routes>
  );
};

export default App;
