import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider }     from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ProtectedRoute }   from './components/ProtectedRoute';

import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import BoardListPage   from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import SettingsPage    from './pages/SettingsPage';

import './index.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <Routes>
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
              {/* Ruta raíz → lista de tableros */}
              <Route path="/"         element={<BoardListPage />} />
              {/* Detalle de un tablero */}
              <Route path="/boards/:id" element={<BoardDetailPage />} />
              {/* Configuraciones de usuario */}
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Cualquier otra → redirige a raíz */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
