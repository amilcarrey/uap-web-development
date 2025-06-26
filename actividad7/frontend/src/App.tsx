import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>
      {/* Redirige de la raíz a /boards/1 */}
      <Route path="/" element={<Navigate to="/boards/1" replace />} />

      {/* Página principal con tareas */}
      <Route path="/boards/:boardId" element={<Home />} />

      {/* Página de configuración */}
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}

export default App;
