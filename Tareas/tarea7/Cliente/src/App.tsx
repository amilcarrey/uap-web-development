import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { BoardManager } from './components/BoardManager';
import { Configuracion } from "./components/Configuracion";
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MsjBienvenida } from './components/MsjBienvenida';
import { OpcionesNav } from './components/OpcionesNav';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Toaster position="top-right" />
      <Header />
      <main style={{
        maxWidth: 600,
        margin: '20px auto',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        {!isHome && <OpcionesNav />}
        <Routes>
          <Route path="/" element={<MsjBienvenida />} />
          <Route path="/board/:boardId" element={<BoardManager />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}


