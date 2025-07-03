// src/Routes.jsx
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/login';
import RutaPrivada from './components/rutaprivada';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
console.log('Cargando rutas…');
