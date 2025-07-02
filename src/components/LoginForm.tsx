// src/components/LoginForm.tsx
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

export default function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      toast.error("Login fallido");
    } else {
      login(username);
      toast.success("Bienvenido");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-xl font-semibold text-center">Iniciar sesión</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" className="w-full border px-3 py-2 rounded" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full border px-3 py-2 rounded" />
      <button type="submit" className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition">Ingresar</button>
    </form>
  );
}