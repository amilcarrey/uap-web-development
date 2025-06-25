import { useState } from "react";
import { useAuthStore } from "../stores/authStore";

export function useLogin() {
  const setUser = useAuthStore(s => s.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (alias: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ alias, password }),
      });
      if (!res.ok) {
        setError("Credenciales incorrectas");
        return false;
      }
      const data = await res.json();
      setUser(data.user);
      return true;
    } catch {
      setError("Error de red");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, setError };
}