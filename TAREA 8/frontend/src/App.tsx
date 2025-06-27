import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Tablero from './pages/Tablero';
import Configuracion from './pages/Configuracion';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';



const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, cargando } = useAuth();
  // Mientras cargando, nunca redirigir ni mostrar children
  if (cargando) return <LoadingSpinner />;
  if (!cargando && isAuthenticated) return <>{children}</>;
  if (!cargando && !isAuthenticated) return <Navigate to="/login" replace />;
  return null;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, cargando } = useAuth();
  // Mientras cargando, nunca redirigir ni mostrar children
  if (cargando) return <LoadingSpinner />;
  if (!cargando && !isAuthenticated) return <>{children}</>;
  if (!cargando && isAuthenticated) return <Navigate to="/dashboard" replace />;
  return null;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {isAuthenticated && <Navbar />}
      
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicRoute>
              <Registro />
            </PublicRoute>
          }
        />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tablero/:id"
          element={
            <ProtectedRoute>
              <Tablero />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracion"
          element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
