import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export function useRegister() {
  const setUser = useAuthStore(s => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (firstName: string, lastName: string, alias: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, alias, password }),
      });
      if (res.status === 401 || res.status === 403) {
        setError("No autorizado para registrarse");
        setUser(null);
        return false;
      }
      if (res.status === 400 || res.status === 404) {
        const data = await res.json();
        setError(data.message || "Datos inválidos");
        setUser(null);
        return false;
      }
      if (!res.ok) {
        setError("No se pudo registrar el usuario");
        setUser(null);
        return false;
      }
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
      setError("Error de red");
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error, setError };
}