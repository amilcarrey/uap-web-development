import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "./useTasks";

const authQueryKey = ["auth-token"];

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: token } = useQuery({
    queryKey: authQueryKey,
    // This query will not fetch data, it's only for storing the token in the cache.
    // We provide a dummy query function that returns null.
    queryFn: () => null,
    // We don't want this query to refetch on its own.
    staleTime: Infinity,
  });

  const { mutate: login, ...loginMutation } = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // OJO ACA
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to login");
      }

      const data: { token: string } = await response.json();
      return data.token;
    },
    
    onSuccess: (receivedToken) => {
      // On successful login, manually set the data for our auth query.
      queryClient.setQueryData(authQueryKey, receivedToken);
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });

  const logout = () => {
    queryClient.setQueryData(authQueryKey, null);
  };

  return { token: token as string | null, login, logout, ...loginMutation };
}