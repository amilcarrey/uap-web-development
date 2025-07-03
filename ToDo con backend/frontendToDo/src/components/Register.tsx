// Register.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register(username, email, password);
      navigate("/dashboard");
    } catch (error) {
      // Error ya manejado en el contexto
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <form
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Registrarse</h2>
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-2 border rounded"
          placeholder="Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-6 p-2 border rounded"
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}
