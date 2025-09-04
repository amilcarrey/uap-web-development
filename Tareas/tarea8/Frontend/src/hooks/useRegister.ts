import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export function useRegister() {
  const register = useAuthStore(s => s.register);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (firstName: string, lastName: string, alias: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await register(firstName, lastName, alias, password);
      if (!success) {
        setError("Error al registrar usuario");
        return false;
      }
      return true;
    } catch {
      setError("Error de red");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register: handleRegister, loading, error, setError };
}