import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: string;
  email: string;
  role: "user" | "admin"; // roles de los usuarios que nos son lo mismo que los permisos que tiene el usuario sobre cada tablero de categoria
}

// Autenticación del usuario
export function useAuthUser() {
  return useQuery<User>({ // devueleve data como User pero tambien puede devolver error, isLoading, etc.
    queryKey: ["auth", "user"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/me`, { // Leer datos
        credentials: 'include', // envía la cookie JWT
      });
      
      if (!res.ok) {
        throw new Error('No autenticado');
      }
      
      return res.json();
    },
    retry: false, // Si falla, no reintenta (significa que no está logueado)
    staleTime: 5 * 60 * 1000, // 5 minutos para que no se vuelvan viejos los datos, evitamos peticiones innecesarias el user puede seguir 
    // autenticado lo que definamos en el back lo que defina cuando se vence la cookie 
  });
}

// hook de registro
export function useRegister() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => { // Escribir datos 
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Error en registro');
      }
      
      return res.json();
    },
  });
}


// hook de login
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Recibimos la cookie JWT del backend
        body: JSON.stringify({ email, password }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Credenciales inválidas');
      }
      
      return res.json();
    },
    onSuccess: () => {
      //  actulizamos para que el usuario esté logueado y no nos redirija a /login
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

// hook de cerrar sesión
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // enviamos cookie para que backend la elimine
      });
      
      if (!res.ok) {
        throw new Error('Error al cerrar sesión');
      }
      
      return res.json();
    },
    onSuccess: () => {
      // Limpia TODA la cache de React Query
      queryClient.clear();
      // redirige a login
      window.location.href = '/login';
    },
  });
}