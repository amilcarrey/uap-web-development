'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  id: string;
  nombre: string;
  email: string;
  iat: number;
  exp: number;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const setUsuario = useUserStore((state) => state.setUsuario);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contraseña }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      const { token } = await res.json();
      localStorage.setItem('token', token);

      // Decodificar el token para obtener los datos del usuario
      const decoded = jwtDecode<DecodedToken>(token);
      setUsuario({
        id: decoded.id,
        nombre: decoded.nombre,
        email: decoded.email,
        token,
      });

      router.push('/');
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
