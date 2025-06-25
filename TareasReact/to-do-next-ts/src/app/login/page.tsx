'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

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
        credentials: 'include', // ✅ Enviar cookie
        body: JSON.stringify({ email, contraseña }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      // ✅ Obtener usuario autenticado desde backend
      const info = await fetch('http://localhost:4000/api/auth/test', {
        credentials: 'include',
      });

      if (!info.ok) {
        setError('Error al obtener datos del usuario');
        return;
      }

      const user = await info.json();
      setUsuario({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        token: '', // ya no se usa, pero mantenelo si querés compatibilidad
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
