import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  email: string;
}

export const useCurrentUser = () => {
  return useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await fetch("http://localhost:4000/api/auth/me", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("No autorizado");
      return res.json();
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};
