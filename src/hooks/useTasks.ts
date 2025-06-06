import { useQuery } from "@tanstack/react-query";
// import API_BASE from "../components/TaskManager.tsx";

const API_BASE = "http://localhost:4321";

export const useTasks = (filter: string, page: number, limit: number, boardId: string) => {
  return useQuery({
    queryKey: ["tasks", filter, page, limit, boardId],
    queryFn: async () => {
      const params = new URLSearchParams({ filter, page: String(page), limit: String(limit), boardId });
      // const res = await fetch(`${API_BASE}/api/tasks?filter=${filter}&page=${page}&limit=${limit}`);
      const res = await fetch(`${API_BASE}/api/tasks?${params.toString()}`);

      if (!res.ok) throw new Error("Error fetching tasks");
      return res.json();
    },
  });
};
