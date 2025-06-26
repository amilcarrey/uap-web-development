import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) {
      setError("El email es obligatorio");
      return false;
    }
    // Simple regex para email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email inválido");
      return false;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(email, password);
      navigate("/boards");
    } catch (err) {
  const message = err instanceof Error ? err.message : "Error al registrarse";
  setError(message);
}

  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrarse</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />
      <button type="submit">Crear cuenta</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
