import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      toast.success("Registro exitoso");
    } else {
      toast.error("Error al registrarse");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Registrarse</h2>
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
        onClick={handleRegister}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Crear cuenta
      </button>
    </div>
  );
}