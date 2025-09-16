import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (mail: string, contraseña: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, contraseña }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return null;
      }
      const data = await res.json();
      setLoading(false);
      return data; 
    } catch (err) {
      setError("Error de red");
      setLoading(false);
      return null;
    }
  };

  return { login, loading, error };
}