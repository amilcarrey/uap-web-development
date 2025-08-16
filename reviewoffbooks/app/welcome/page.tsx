'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login
      if (username.trim() && password.trim()) {
        localStorage.setItem('currentUser', username.trim());
        localStorage.setItem('userEmail', email || '');
        router.push('/dashboard');
      }
    } else {
      // Registro
      if (username.trim() && email.trim() && password.trim()) {
        localStorage.setItem('currentUser', username.trim());
        localStorage.setItem('userEmail', email.trim());
        localStorage.setItem('userPassword', password);
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Logo y título */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-light text-black mb-4">
            ReviewOffBooks
          </h1>
          <p className="text-gray-600 text-lg">
            Descubre, califica y comparte tus libros favoritos
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 text-center transition-colors ${
                isLogin 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 text-center transition-colors ${
                !isLogin 
                  ? 'text-black border-b-2 border-black' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario
              </label>
                             <input
                 type="text"
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
                 placeholder="Ingresa tu nombre de usuario"
                 required
               />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                                 <input
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
                   placeholder="Ingresa tu email"
                   required={!isLogin}
                 />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
                             <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black text-black"
                 placeholder="Ingresa tu contraseña"
                 required
               />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          </form>

          {isLogin && (
            <p className="text-center text-gray-500 text-sm mt-6">
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setIsLogin(false)}
                className="text-black hover:underline"
              >
                Regístrate aquí
              </button>
            </p>
          )}
        </div>

        {/* Características */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-black mb-4">
            ¿Por qué ReviewOffBooks?
          </h3>
          <div className="grid grid-cols-1 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">📚</span>
              <span>Descubre miles de libros</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">⭐</span>
              <span>Califica y comparte reseñas</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">👥</span>
              <span>Conecta con otros lectores</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
