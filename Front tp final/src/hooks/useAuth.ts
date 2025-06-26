// src/hooks/useAuth.ts
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

export function useAuth() {
  const queryClient = useQueryClient();

  // Query para validar autenticación con cookies
  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["auth-status"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/auth/validate", {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return { authenticated: false };
        }
        throw new Error("Error de servidor");
      }
      
      const data = await response.json();
      return data; // Ya tiene authenticated: true y user
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 5 * 60 * 1000,
  });

  // ---------------------- LOGIN --------------------------------------------------
  // La mutación de login no necesita el token, ya que la autenticación se maneja con cookies
  const { mutate: login, ...loginMutation } = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ name, password }: { name: string; password: string }) => {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name, password }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al iniciar sesión");
      return true; // No necesitamos el token aquí
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-status"] });
    },
  });

  // --------------------- LOGOUT ---------------------
  // Logout invalida la query de cookies y elimina las queries de boards y tasks
  const { mutate: logout } = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await fetch("http://localhost:3000/api/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al cerrar sesión");
      return true;
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-status"], { authenticated: false });
      queryClient.removeQueries({ queryKey: ["boards"] });
      queryClient.removeQueries({ queryKey: ["tasks"] });
      queryClient.removeQueries({ queryKey: ["reminders"] });
      queryClient.removeQueries({ queryKey: ["user-config"] });
    },
  });

  return { 
    isAuthenticated: authData?.authenticated || false,
    user: authData?.user, // ← Usar el usuario de la cookie
    isLoading,
    login,
    logout,
    ...loginMutation 
  };
}
