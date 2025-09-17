import { useState } from "react";

// Obtiene el token JWT desde localStorage o cookie
function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
  return match ? match[1] : null;
}

export function useResenas() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resenas, setResenas] = useState<any[]>([]);

  // Obtener reseñas (GET)
  const fetchResenas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/resenas");
      const data = await res.json();
      setResenas(data);
      setLoading(false);
    } catch (err) {
      setError("Error al cargar reseñas");
      setLoading(false);
    }
  };

  // Crear reseña (POST, requiere JWT)
  const crearResena = async (libroId: string, texto: string, rating: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ libroId, texto, rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear reseña");
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

  // Votar reseña (PATCH, requiere JWT)
  const votarResena = async (resenaId: string, tipo: "like" | "dislike") => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/resenas", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ reseñaId: resenaId, tipo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al votar reseña");
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

  // Editar reseña propia (PATCH, requiere JWT)
  const editarResena = async (resenaId: string, texto?: string, rating?: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/resenas", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ reseñaId: resenaId, texto, rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al editar reseña");
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

  // Eliminar reseña propia (DELETE, requiere JWT)
  const eliminarResena = async (resenaId: string) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch("/api/resenas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ reseñaId: resenaId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al eliminar reseña");
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

  return { resenas, loading, error, fetchResenas, crearResena, votarResena, editarResena, eliminarResena };
}
