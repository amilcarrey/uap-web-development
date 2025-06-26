import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useActualizarUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      capitalizeTasks: boolean;
      refreshInterval: number;
    }) => {
      const res = await api.put("/auth/preferences", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
};
