import React, { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useNotificacionesStore } from "./store/useNotificacionesStore";
import { useNavigate } from "@tanstack/react-router";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, error } = useAuth();
  const notificar = useNotificacionesStore((s) => s.agregar);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await register(nombre, email, password); // <-- nombre primero
    if (result) {
      notificar("Usuario registrado exitosamente", "success");
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="mt-40 bg-gray-150 bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-3xl shadow-lg w-[90%] max-w-2xl mx-auto p-8 flex flex-col gap-6 text-gray-800">
      <form
        onSubmit={handleSubmit}
        className="max-w-xs mx-auto flex flex-col gap-4"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded px-3 py-2"
        />
        <button type="submit" className="bg-black text-white rounded px-3 py-2">
          Registrarse
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </form>
    </div>
  );
};

export default Register;
