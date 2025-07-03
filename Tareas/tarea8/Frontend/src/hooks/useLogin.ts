import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

      console.log("Login exitoso, invalidando consultas...");
      await queryClient.invalidateQueries();

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
