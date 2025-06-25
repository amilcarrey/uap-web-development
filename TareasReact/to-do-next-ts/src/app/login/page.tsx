'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';
import { useConfigStore } from '@/stores/configStore';

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
        credentials: 'include',
        body: JSON.stringify({ email, contraseña }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

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
        token: '',
      });

      const cargarConfiguracion = useConfigStore.getState().cargarConfiguracion;
      await cargarConfiguracion();

      router.push('/');
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="w-full max-w-md bg-white/90 rounded-xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold text-cyan-700 mb-1">Iniciar sesión</h2>
          <p className="text-gray-500 text-sm">Accedé a tu cuenta para continuar</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-cyan-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition text-gray-500
            "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="text-gray-500 w-full px-4 py-2 border border-cyan-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            value={contraseña}
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-700 text-white font-semibold py-2 rounded hover:bg-cyan-800 transition"
          >
            Ingresar
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          ¿No tenés cuenta?{' '}
          <a href="/register" className="text-cyan-700 hover:underline font-medium">
            Registrate
          </a>
        </div>
      </div>
    </div>
  );
}
