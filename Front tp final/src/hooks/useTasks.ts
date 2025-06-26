
  import { useQuery } from "@tanstack/react-query";
  
export const useTasks = (boardId: string, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["tasks", boardId, page, limit],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/reminder/${boardId}?page=${page}&limit=${limit}`,
        { credentials: "include" }
      );
      if (!res.ok) throw new Error("Error fetching reminders");
      return res.json();        // ← { reminders, pagination }
    },
    enabled: !!boardId,
  });



  // const BASE_URL = "http://localhost:4321/api";

  // interface PaginatedTasks {
  //   some: any;
  //   reminders: Reminder[];
  //   total: number;
  //   page: number;
  //   limit: number;
  //   filter: string;
  //   boardId: string;
  // }
  // export function useTasks(boardId: string, page: number, limit: number) {
  //   const filter = useTaskStore((s) => s.filter); // 👈 ahora se toma de Zustand
  //   const refetchInterval = useConfigStore((s) => s.refetchInterval);

  //   return useQuery<PaginatedTasks>({
  //     queryKey: ["tasks", boardId, page, limit, filter], // 👈 ¡clave depende del filtro!
  //     queryFn: async () => {
  //       const params = new URLSearchParams({
  //         boardId,
  //         page: page.toString(),
  //         limit: limit.toString(),
  //         filter,
  //       });

  //       const res = await fetch(`${BASE_URL}/filter?${params.toString()}`);
  //       if (!res.ok) throw new Error("Error al obtener las tareas");
  //       return res.json();
  //     },
  //     placeholderData: (prev) => prev,
  //     refetchInterval,
  //   });
  // }
