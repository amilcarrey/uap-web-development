import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import TaskManager from './components/TaskManager';
import UsuarioPage from './components/UsuarioPage';
import ProtectedRoute from './components/PrivateRoute';
import ConfiguracionPanel from './components/ConfiguracionPanel';

const App = () => {
  const location = useLocation();

  // Efecto para cambiar clases del body según la ruta actual (imagenes de fondo)
  useEffect(() => {
    if (location.pathname === '/main') {
      document.body.classList.add('bg-main');
      document.body.classList.remove('bg-default');
    } else {
      document.body.classList.add('bg-default');
      document.body.classList.remove('bg-main');
    }
  }, [location.pathname]);

  return (
    <Routes>
      {/* Redirige la raíz a tablero con id 1 */}
      <Route path="/" element={<Navigate to="/tablero/1" replace />} />

      {/* Ruta protegida para el TaskManager con parámetro id y opcional slug */}
      <Route
        path="/tablero/:id/:slug?"
        element={
          <ProtectedRoute>
            <TaskManager />
          </ProtectedRoute>
        }
      />

      {/* Ruta protegida para la configuración */}
      <Route
        path="/configuracion"
        element={
          <ProtectedRoute>
            <ConfiguracionPanel />
          </ProtectedRoute>
        }
      />

      {/* Página pública de login/registro */}
      <Route path="/main" element={<UsuarioPage />} />
    </Routes>
  );
};

export default App;
