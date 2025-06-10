import { useQuery } from "@tanstack/react-query";

const API_BASE = "http://localhost:4321";

export function useTasks(
  filter: string,
  page: number,
  limit: number,
  boardId: string,
  refetchInterval = 10000 // por defecto 10s
) {
  return useQuery({
    queryKey: ['tasks', { filter, page, limit, boardId }],
    queryFn: async () => {
      const params = new URLSearchParams({ filter, page: String(page), limit: String(limit), boardId });
      const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`);

      if (!res.ok) throw new Error("Error fetching tasks");
      return res.json();
    },
    refetchInterval,
  });
}
