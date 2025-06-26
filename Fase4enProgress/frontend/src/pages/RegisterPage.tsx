import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Registrarse</h2>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full border mb-2 p-2" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full border mb-2 p-2" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Registrarse</button>
        <p className="text-sm mt-4 text-center">
            ¿Ya tenés cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
                Iniciá sesión
            </Link>
        </p>
    </form>

  );
};

export default RegisterPage;
