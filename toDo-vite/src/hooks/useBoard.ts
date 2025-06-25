import { useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import type { Board } from "../types";
import type { BoardUser } from "../types";
import { useEffect } from "react";

import { useAuth } from "../hooks/useAuth";

export const BASE_URL = "http://localhost:4321/api";

type BoardsResponse = {
  boards: Board[];
};

export function useBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/boards`, {
        credentials: 'include', 
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        console.error(`Error al obtener tableros: ${res.status}`);
        throw new Error(`Error al obtener tableros: ${res.status}`);
      }
      const rawData = await res.json();
      console.log("Raw data from boards:", rawData);

      const normalizedData = Array.isArray(rawData)
        ? { boards: rawData }
        : rawData;

      return normalizedData;

    },
  });
}

export function useSingleBoard(boardId: string) {
  return useQuery({
    queryKey: ["board", boardId],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/boards/${boardId}`, {
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Error al obtener tablero: ${res.status}`);
      }
      const data = await res.json();
      return data; 
    },
    enabled: !!boardId,
  });
}

export function useCreateBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name }: { name: string }) => {
      const res = await fetch(`${BASE_URL}/boards`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        throw new Error(`Error al crear tablero: ${res.status}`);
      }

       return res.json(); 


    },
    onSuccess: () => {
      console.log("Tablero creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${BASE_URL}/boards/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Error al eliminar tablero");
      return response.status === 204 ? null : response.json();
    },
    onSuccess: () => {
      console.log("Tablero eliminado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
}

export function useBoardUsers(boardId: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const result = useQuery({
    queryKey: ['board', boardId, 'users', user?.id],
    queryFn: async () => {
      if (!boardId) throw new Error('ID del tablero requerido');
      
      const res = await fetch(`${BASE_URL}/boards/${boardId}/users`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error(`Error al obtener usuarios: ${res.status}`);
      }
      
      const data = await res.json();

      const currentUserId = data.currentUserId;
      return {
        ...data,
        currentUserId,
      };
    },
    refetchOnMount: true, 
    staleTime: 0
  });
  

  
  useEffect(() => {
    if (result.isSuccess && result.data && user) {
      const isCurrentUserOwner = result.data.users?.some(
        (u: BoardUser) => String(u.user_id) === String(user.id) && u.role === "owner"
      );
      queryClient.setQueryData(['board', boardId, 'isOwner'], isCurrentUserOwner);
    }
  }, [result.isSuccess, result.data, user, boardId, queryClient]);
  
  return result;
}




export function useAddUserToBoard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role:string }) => {
      const res = await fetch(`${BASE_URL}/boards/${boardId}/users`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Error desconocido" }));
        throw new Error(errorData.message || `Error al añadir usuario: ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => {
      console.log("Usuario añadido al tablero exitosamente");
      queryClient.invalidateQueries({ queryKey: ['board', boardId, 'users'] });
    },
    onError: (error: Error) => {
      console.error("Error al añadir usuario:", error);
      alert(`Error: ${error.message}`);
    },
  });
}

export function useRemoveUserFromBoard(boardId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`${BASE_URL}/boards/${boardId}/users/${userId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al eliminar usuario del tablero: ${res.status}`);
      }
      return res.json();
    },
    onSuccess: () => {
      console.log("Usuario eliminado del tablero exitosamente");
      queryClient.invalidateQueries({ queryKey: ['board', boardId, 'users'] });
    },
  });
}


