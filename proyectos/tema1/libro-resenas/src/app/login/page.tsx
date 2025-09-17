'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '../hooks/useLogin';

function setTokenCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=86400`;
}

function setUserCookie(user: string) {
  document.cookie = `user=${encodeURIComponent(user)}; path=/; max-age=86400`;
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function Login() {
  const [form, setForm] = useState({ mail: '', contraseña: '' });
  const { login, loading, error } = useLogin();
  const [bienvenida, setBienvenida] = useState('');
  const router = useRouter();
  const [cerrando, setCerrando] = useState(false);

  const handleLogout = async () => {
    setCerrando(true);
    // Borrar cookies en frontend
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    await fetch('/api/logout', { method: 'POST' });
    setTimeout(() => {
      router.push('/login');
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await login(form.mail, form.contraseña);
    if (data && data.ok) {
      setTokenCookie(data.token);
      setUserCookie(form.mail);
      setBienvenida(`Bienvenido/a, ${form.mail}`);
      setTimeout(() => {
        router.push('/');
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">

      {/*Mensaje de bienvenida*/}
      {bienvenida && (
        <div className="text-green-700 bg-green-100 border border-green-400 px-4 py-2 rounded mb-4 text-center font-semibold">
          {bienvenida}
        </div>
      )}

      {/* Card de login */}
      <form
        onSubmit={handleSubmit}
        className="z-10 bg-white bg-opacity-90 rounded-lg shadow-lg px-8 py-8 w-full max-w-sm flex flex-col gap-4"
      >
        <label className="text-gray-700 font-semibold">Email</label>
        <input
          name="mail"
          type="email"
          placeholder="Email"
          value={form.mail}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <label className="text-gray-700 font-semibold">Contraseña</label>
        <input
          name="contraseña"
          type="password"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 rounded transition-colors"
        >
          {loading ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          disabled={cerrando}
          className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded transition-colors"
        >
          {cerrando ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </button>
        {error && <div className="text-pink-600 text-center font-medium">{error}</div>}
        <a href="#" className="text-sm text-gray-700 hover:underline mt-2 text-center">
          ¿Olvidó su contraseña?
        </a>
      </form>
    </div>
  );
}