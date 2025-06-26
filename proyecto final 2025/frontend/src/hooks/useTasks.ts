import { useQuery } from "@tanstack/react-query";

const API_BASE = "http://localhost:3000";

export function useTasks(
  filter: string,
  page: number,
  limit: number,
  boardId: string,
  refetchInterval = 10000,
  search = ""
) {
  return useQuery({
    queryKey: ['tasks', { filter, page, limit, boardId, search }],
    queryFn: async () => {
      const params = new URLSearchParams({ 
        filter, 
        page: String(page), 
        limit: String(limit), 
        boardId: boardId,
        search,
      });
      
      const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`, {
      credentials: "include",
    });

      if (!res.ok) throw new Error("Error fetching tasks");
      return res.json();
    },
    refetchInterval,
  });
}
