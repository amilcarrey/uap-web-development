// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async (): Promise<User[]> => {
      const response = await fetch("http://localhost:3000/api/auth/", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Error al obtener usuarios");
      }
      
      return response.json();
    },
  });
}
