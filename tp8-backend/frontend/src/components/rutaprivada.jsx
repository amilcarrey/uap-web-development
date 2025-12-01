// components/RutaPrivada.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthstore';

export default function RutaPrivada({ children }) {
  const { usuario, setUsuario } = useAuthStore();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/auth/yo', {
      credentials: 'include',
    })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setUsuario(data.usuario);
      })
      .catch(() => {
        // usuario no autenticado
      })
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <p>Cargando...</p>;
  if (!usuario) return <Navigate to="/login" />;
  return children;
}
