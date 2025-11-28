import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";

export function useBoardRole(boardId: string) {
  return useQuery({
    queryKey: ["boardRole", boardId],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/boards/${boardId}/role`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch board role");
      
      const data = await response.json();
      return data.role;
    },
    enabled: !!boardId,
  });
}
