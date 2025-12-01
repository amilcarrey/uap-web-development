// pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthstore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setUsuario = useAuthStore(s => s.setUsuario);
  const navigate = useNavigate();

  const handleLogin = async () => {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 👈 ¡Esto es CLAVE!
    body: JSON.stringify({ email, password }),
  });

  if (res.ok) {
    const perfilRes = await fetch('http://localhost:3000/api/auth/yo', {
      credentials: 'include',
    });
    const usuario = await perfilRes.json();
    setUsuario(usuario); // Asegurate que `setUsuario` venga de tu store correctamente
    navigate('/tableros');
  } else {
    const error = await res.json();
    alert(error.error || 'Error al iniciar sesión');
  }
};


  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
