import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (mail: string, contrasena: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, contrasena }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al iniciar sesión");
        setLoading(false);
        return null;
      }
      const data = await res.json();
      if (data.token) {
        // Guardar el token en la cookie (1 día, solo para frontend)
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
      }
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