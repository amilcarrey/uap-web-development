// src\App.tsx

//import { useState } from 'react';
import { Toaster } from 'react-hot-toast'; // Componente para mostrar notificaciones emergentes
import { Header } from './components/Header';               // Encabezado principal de la aplicación
//import { TabsContainer } from './components/TabsContainer'; // Componente para mostrar las pestañas de categorías
//import { TabContent } from './components/TabContent';       // Componente que representa el contenido de cada pestaña
import { BoardManager } from './components/BoardManager';
import { Configuracion } from "./components/Configuracion";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MsjBienvenida } from './components/MsjBienvenida';
import {OpcionesNav} from './components/OpcionesNav'; // Componente para mostrar opciones de navegación


export default function App() {

  const location = useLocation();
  const isHome = location.pathname === '/'; // Verifica si la ruta actual es la raíz (home)

  return (
    <>
      {/* Encabezado de la aplicación (título, logo, etc.) */}
      
      <Toaster position="top-right" /> {/* Notificaciones emergentes */}
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
      
      {!isHome && <OpcionesNav/>}

      {/* Rutas de la aplicación */}
        <Routes>
          {/* Ruta principal que muestra el gestor de tableros (por defecto) */}
          <Route path="/" element={<MsjBienvenida/>}/> 

          {/* Ruta para el gestor de tableros, con un parámetro de ID de tablero */}
          <Route path="/board/:boardId" element={<BoardManager/>}/> 
          <Route path="/configuracion" element={<Configuracion />} />

          {/* Redirige cualquier ruta desconocida a la raíz */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
   
      </main>
    </>
  );
}


