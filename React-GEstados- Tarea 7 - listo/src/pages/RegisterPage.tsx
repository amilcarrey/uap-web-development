import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { useUserStore } from "../store";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
//   const setUser = useUserStore((s) => s.setUser);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Error al registrar usuario");
      }
      // Después de registrarse, redirigir al login
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow p-8 rounded w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
        <div className="mt-4 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 underline">Iniciar Sesión</Link>
        </div>
      </form>
    </div>
  );
}
