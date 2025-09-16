import { useState } from "react";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const register = async (mail: string, contraseña: string, role: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, contraseña, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al registrar usuario");
        setLoading(false);
        return null;
      }
      setSuccess("Usuario registrado correctamente");
      setLoading(false);
      return data;
    } catch (err) {
      setError("Error de red");
      setLoading(false);
      return null;
    }
  };

  return { register, loading, error, success };
}