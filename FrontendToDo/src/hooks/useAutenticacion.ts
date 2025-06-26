import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuthStatus() {
  return useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const res = await fetch("http://localhost:3001/api/usuarios/check-auth", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No autenticado");
      return res.json();
    },
    retry: false,
  });
}

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch("http://localhost:3001/api/usuarios/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al iniciar sesión");
      }

      return res.json();
    },
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
      queryClient.invalidateQueries({ queryKey: ["tableros"] }); 
      navigate({ to: "/tablero/$alias", params: { alias: "configuracion" } });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ nombre, email, password }: { nombre: string; email: string; password: string }) => {
      const res = await fetch("http://localhost:3001/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al registrarse");
      }

      return res.json();
    },
    onSuccess: (data, variables) => {
      // Después del registro exitoso, hacer login automáticamente
      loginMutation.mutate({ email: variables.email, password: variables.password });
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const login = async (email: string, password: string) => {
    setError(null);
    loginMutation.mutate({ email, password });
  };

  const register = async (nombre: string, email: string, password: string) => {
    setError(null);
    registerMutation.mutate({ nombre, email, password });
  };

  return {
    login,
    register,
    loading: loginMutation.isPending || registerMutation.isPending,
    error: error || loginMutation.error?.message || registerMutation.error?.message,
  };
}