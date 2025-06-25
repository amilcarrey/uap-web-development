import { useState } from 'react';

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' o 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Nuevo estado para mensajes de éxito

  const handleTab = (tab) => {
    setMode(tab);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
    setConfirm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (mode === 'register' && password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = { username, password };

    const res = await fetch(`http://localhost:4000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Error');
    } else {
      setUsername('');
      setPassword('');
      setConfirm('');
      if (mode === 'login') {
        onAuthSuccess && onAuthSuccess();
      } else {
        setMode('login');
        setSuccess('¡Registro exitoso! Ahora inicia sesión.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6 border-b">
          <button
            className={`px-6 py-2 font-bold transition-all ${
              mode === 'login' ? 'text-green-600 text-lg border-b-2 border-green-500' : 'text-gray-600'
            }`}
            onClick={() => handleTab('login')}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 font-bold transition-all ${
              mode === 'register' ? 'text-green-600 text-lg border-b-2 border-green-500' : 'text-gray-600'
            }`}
            onClick={() => handleTab('register')}
          >
            Register
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {mode === 'register' && (
            <input
              type="password"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className={`w-full py-3 rounded font-bold text-white transition-all ${
              mode === 'login'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {mode === 'login' ? 'Log In' : 'Register Now'}
          </button>
        </form>
        {mode === 'login' && (
          <div className="text-center mt-4">
            <a href="#" className="text-gray-500 underline hover:text-gray-700 text-sm">
              Forgot Password?
            </a>
          </div>
        )}
      </div>
    </div>
  );
}