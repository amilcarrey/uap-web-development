import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../services/authApi'; // ✅ nuevo import

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await authApi.login(email, password);
    const token = response.data.token;

    if (!token) throw new Error('Token no recibido');

    localStorage.setItem('token', token); // ✅ Guardar token

    toast.success('✅ Sesión iniciada correctamente');
    navigate('/boards');
  } catch (err: any) {
    console.error('❌ Error en login:', err);
    const msg = err.response?.data?.error || 'Error al iniciar sesión';
    toast.error(`❌ ${msg}`);
  }
};


  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full border px-4 py-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="w-full border px-4 py-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          type="password"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
