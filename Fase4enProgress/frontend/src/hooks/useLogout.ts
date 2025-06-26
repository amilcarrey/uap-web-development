import { useMutation, useQueryClient } from "@tanstack/react-query";

const logoutUser = async (): Promise<void> => {
  const res = await fetch("http://localhost:4000/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al hacer logout");
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
    },
  });
};
