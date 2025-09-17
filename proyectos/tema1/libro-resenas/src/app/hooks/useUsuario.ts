import { useState } from "react";

function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? match[1] : null;
}

export function useUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<any>(null);

  // Obtener perfil, historial y favoritos
  const fetchUsuario = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/usuario", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al obtener usuario");
        setLoading(false);
        return null;
      }
      setUsuario(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError("Error de red");
      setLoading(false);
      return null;
    }
  };

  // Editar mail
  const editarMail = async (mail: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/usuario", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ mail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al editar mail");
        setLoading(false);
        return null;
      }
      setUsuario(data);
      setLoading(false);
      return data;
    } catch (err) {
      setError("Error de red");
      setLoading(false);
      return null;
    }
  };

  // Agregar favorito
  const agregarFavorito = async (libroId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ libroId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al agregar favorito");
        setLoading(false);
        return null;
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError("Error de red");
      setLoading(false);
      return null;
    }
  };

  // Eliminar favorito
  const eliminarFavorito = async (libroId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/usuario", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ libroId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al eliminar favorito");
        setLoading(false);
        return null;
      }
      setLoading(false);
      return data;
    } catch (err) {
      setError("Error de red");
      setLoading(false);
      return null;
    }
  };

  return { usuario, loading, error, fetchUsuario, editarMail, agregarFavorito, eliminarFavorito };
}
