import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { loginUser } from "../api/auth";
import type { AuthFormData } from "../types/auth";

export function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async (data: AuthFormData) => {
    try {
      const user = await loginUser(data);
      alert("Login exitoso");
      console.log("Usuario:", user);
      navigate("/home");
    } catch (error: any) {
      alert(error.message || "Error en el login");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <AuthForm
        onSubmit={handleLogin}
        title="Iniciar sesión"
        submitText="Entrar"
        includeUsername={false}
      />

      {/* Botón para ir a registro */}
      <button
        onClick={() => navigate("/register")}
        className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
      >
        Crear cuenta
      </button>
    </div>
  );
}
