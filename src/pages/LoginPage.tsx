import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setAuth = useAuthStore((s) => s.setAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = mode === "login" ? "login" : "register";
    const res = await fetch(`/api/auth/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      toast.success(mode === "login" ? "Login exitoso" : "Registro exitoso");
      if (mode === "login") {
        setAuth(true);
        setUser(username);
        navigate("/");
      } else {
        setUsername("");
        setPassword("");
        setMode("login");
      }
    } else {
      toast.error(`Error al ${mode === "login" ? "iniciar sesión" : "registrarse"}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffaf0] flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">
          {mode === "login" ? "Iniciar sesión" : "Registrarse"}
        </h2>
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
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {mode === "login" ? "Ingresar" : "Crear cuenta"}
        </button>
        <button
          className="mt-4 text-sm text-yellow-600 hover:underline"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login"
            ? "¿No tienes cuenta? Regístrate"
            : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </div>
  );
}