import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
      toast.success("Sesión iniciada");
      navigate("/");
    } else {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded p-6 shadow w-full max-w-md">
        <h1 className="text-xl font-bold mb-4 text-yellow-700">Iniciar sesión</h1>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-neutral-900 text-white px-4 py-2 rounded hover:bg-neutral-800"
        >
          Entrar
        </button>
        <button
          type="button"
          className="w-full mt-3 text-sm text-yellow-600 underline"
          onClick={() => navigate("/registro")}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </form>
    </div>
  );
}