import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const login = useAuthStore(s => s.login);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (alias: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await login(alias, password);
      if (!success) {
        setError("Credenciales incorrectas");
        return false;
      }
      // Navegación después de login exitoso
      console.log("Login exitoso, navegando...");
      navigate("/", { replace: true });
      return true;
    } catch {
      setError("Error de red");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login: handleLogin, loading, error, setError };
}