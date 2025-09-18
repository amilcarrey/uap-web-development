import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch current user");
      const data = await response.json();
      return data.user;
    },
    staleTime: 5 * 60 * 1000,
  });
}
