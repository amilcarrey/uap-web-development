//cada vez q cargue y haya usuario, zustand se actualiza c ese user

import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Tablero from "./pages/Tablero";
import Home from "./pages/Home";
import AdminTableros from "./pages/AdminTableros";
import ConfiguracionPage from "./pages/Configuracion";

import { useAuthStore } from './store/authStore';
import { useCurrentUser } from './hooks/useCurrentUser';

const App = () => {
  const { data: user, isSuccess } = useCurrentUser();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    if (isSuccess && user) {
      login(user);
    }
  }, [isSuccess, user, login]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tablero/:tableroId" element={<Tablero />} />
        <Route path="admin" element={<AdminTableros />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;
