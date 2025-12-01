// src/Routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App'; // ✅ tu componente principal
import Login from './pages/login';
import Register from './pages/Register';
import RutaPrivada from './components/rutaprivada';
import Tableros from './pages/tableros';


export default function AppRoutes() {
  console.log('Cargando rutas…');
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tableros" element={<Tableros />} />
      <Route
        path="/"
        element={
          <RutaPrivada>
            <App />
          </RutaPrivada>
        }
      />
    </Routes>
  );
}
