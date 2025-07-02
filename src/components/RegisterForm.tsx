// src/components/RegisterForm.tsx
import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      toast.error("Error al registrarse");
    } else {
      toast.success("Registro exitoso");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-xl font-semibold text-center">Registrarse</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" className="w-full border px-3 py-2 rounded" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full border px-3 py-2 rounded" />
      <button type="submit" className="w-full bg-neutral-900 text-white py-2 rounded hover:bg-neutral-800 transition">Crear cuenta</button>
    </form>
  );
}