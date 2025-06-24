import { useState } from "react";
import { useAuth } from "../hooks/useAutenticacion";

export default function AutenticacionPagina() {
  const [isLogin, setIsLogin] = useState(true);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, error, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login(email, password); // Quitar await - ahora no es necesario
    } else {
      register(nombre, email, password); // Quitar await - ahora no es necesario
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-pink-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md flex flex-col gap-3 min-w-[300px]">
        <h2 className="text-2xl font-bold mb-2 text-center">{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>
        {!isLogin && (
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="border p-2 rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 rounded"
        >
          {isLogin ? "Entrar" : "Registrarse"}
        </button>
        <button
          type="button"
          className="text-blue-500 underline text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </form>
    </div>
  );
}