import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";
import type { Board } from "../store/useBoardStore";

export function useUserBoards() {
  return useQuery({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/boards`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }

      const data = await response.json();
      return data as Board[];
    },
  })
}