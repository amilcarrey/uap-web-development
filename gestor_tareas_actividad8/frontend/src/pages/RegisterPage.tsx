import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../services/authApi'; // ✅ nuevo import

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authApi.register(name, email, password); // ✅ usa axios
      toast.success('✅ Registro exitoso. Iniciá sesión.');
      navigate('/login');
    } catch (err: any) {
      console.error('❌ Error en registro:', err);
      const msg = err.response?.data?.error || 'Error al registrarse';
      toast.error(`❌ ${msg}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registro</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="w-full border px-4 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nombre"
          required
        />
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
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
