import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/App.css";

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setError(null);
    console.log("Registrando:", { email, password });


    navigate("/login");
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Registro</h2>
      {error && <p className="error">{error}</p>}

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Registrarse</button>

      <p>
        ¿Ya tenes cuenta? <Link to="/login">Iniciar sesión</Link>
      </p>
    </form>
  );
};

export default RegisterForm;
