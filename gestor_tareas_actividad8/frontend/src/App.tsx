import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import BoardListPage from './pages/BoardListPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Routes>

      {/* Redirige de la raíz a la lista de tableros 
      <Route path="/" element={<Navigate to="/boards" replace />} /> */}
      <Route path="/" element={<LandingPage />} />

      {/* Página para ver y administrar tableros */}
      <Route path="/boards" element={<BoardListPage />} />

      {/* Página principal con tareas de un tablero específico */}
      <Route path="/boards/:boardId" element={<Home />} />

      {/* Página de configuración */}
      <Route path="/settings" element={<Settings />} />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

    </Routes>
  );
}

export default App;
