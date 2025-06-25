import { useState } from "react";
import axios from "axios";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const login = async (nombre: string, password: string) => {
    setError(null);
    try {
      const res = await axios.post(
        "http://localhost:8008/api/auth/login",
        { nombre, password },
        { withCredentials: true }
      );
      return res.data; // { nombre, role }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Error desconocido al iniciar sesión"
      );
      return null;
    }
  };

  const register = async (nombre: string, email: string, password: string) => {
    setError(null);
    try {
      const res = await axios.post("http://localhost:8008/api/auth/register", {
        nombre,
        email,
        password,
      });
      return res.data;
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError("El usuario ya existe");
      } else {
        setError("No se pudo registrar el usuario");
      }
      return null;
    }
  };

  return { login, register, error };
}