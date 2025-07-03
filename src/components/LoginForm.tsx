import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((s) => s.setAuthenticated);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setAuth(true);
      toast.success("Login exitoso");
      navigate("/");
    } else {
      toast.error("Login fallido");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Iniciar sesión</h2>
      <input
        className="w-full mb-3 px-3 py-2 border rounded"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="w-full mb-3 px-3 py-2 border rounded"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Ingresar
      </button>
    </div>
  );
}