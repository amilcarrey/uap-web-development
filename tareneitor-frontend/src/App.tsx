import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import { TableroPage } from "./pages/TableroPage";
import { ConfigPage } from "./pages/ConfigPage";

// Componente principal de la aplicación
function App() {
  return (
    <Routes>
      {/* Redirige la ruta raíz "/" a "/home" */}
      <Route path="/" element={<Navigate to="/home" />} />
      {/* Ruta para la página de registro */}
      <Route path="/register" element={<RegisterPage />} />
      {/* Ruta para la página de login */}
      <Route path="/login" element={<LoginPage />} />
      {/* Ruta para la página principal (home) */}
      <Route path="/home" element={<HomePage />} />
      <Route path="/tableros/:id" element={<TableroPage />} />
      <Route path="/configuracion" element={<ConfigPage />} />
    </Routes>
  );
}

export default App;
