import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";  
import "../styles/App.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Completa todos los campos.");
      return;
    }

    setError(null);
    console.log("Ingresando:", { email, password });


    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <h2>Iniciar sesión</h2>
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

      <button type="submit">Ingresar</button>

      <p>
        ¿No tenes cuenta? <Link to="/register">Regístrate</Link> {/* Usa Link */}
      </p>
    </form>
  );
};

export default LoginForm;
