// src/pages/LoginPage.tsx
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";


const LoginPage = () => {
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
    <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>
    <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full border mb-2 p-2"
    />
    <input
    type="password"
    placeholder="Contraseña"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full border mb-2 p-2"
    />
    <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Entrar
    </button>

    {/* Agregar este link */}
    <p className="text-sm mt-4 text-center">
    ¿No tenés cuenta?{" "}
    <Link to="/register" className="text-blue-600 hover:underline">
        Registrate acá
    </Link>
    </p>
    </form>
  );
}

export default LoginPage;
