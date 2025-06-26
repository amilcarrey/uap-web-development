// src/pages/RegisterPage.jsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RegisterPage() {
  const [email, setEmail]     = useState('');
  const [password, setPass]   = useState('');
  const { register }          = useContext(AuthContext);
  const navigate              = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await register(email, password);
      alert('Registrado con éxito. Por favor haz login.');
      navigate('/login');
    } catch {
      alert('Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none"
            value={password}
            onChange={e => setPass(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
        >
          Registrar
        </button>
        <p className="mt-4 text-center">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
