import type { Board } from "../store/useBoardStore";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";


export function useBoards() {
  const queryKey = ["boards"];

  return useQuery<Board[]>({
    queryKey,
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/listarTableros`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: Board[] = await response.json();
      return data;
    },
    // initialData: [],
    staleTime: 0,
  });
}