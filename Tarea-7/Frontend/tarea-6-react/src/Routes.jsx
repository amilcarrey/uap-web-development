// src/Routes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/tablero/:boardId" element={<App />} />
      {/* Ruta raíz redirige a tablero default */}
      <Route path="*" element={<Navigate to="/tablero/default" replace />} />
    </Routes>
  );
}
