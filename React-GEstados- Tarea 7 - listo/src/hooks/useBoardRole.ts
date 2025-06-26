import { useQuery } from "@tanstack/react-query";
import { fetchBoardPermissions } from "../api";
import { useUserStore } from "../store";

export function useBoardRole(boardId: string) {
  const user = useUserStore(s => s.user);
  
  console.log("Usuario frontend:", user);
  return useQuery({
    queryKey: ["boardRole", boardId],
    queryFn: () => fetchBoardPermissions(boardId),
    enabled: !!boardId && !!user,
    select: (permisos) => {
      if (!user) return null;
      // Busca tu propio permiso en el board
      const myPerm = permisos.find((p: any) => p.user.username === user.username);
      return myPerm?.role || null;
    }
  });
}
