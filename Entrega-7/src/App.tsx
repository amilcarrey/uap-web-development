//src/App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Tablero from "./pages/Tablero";
import Home from "./pages/Home";
import AdminTableros from "./pages/AdminTableros";
import ConfiguracionPage from "./pages/Configuracion";


const App = () => {
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
