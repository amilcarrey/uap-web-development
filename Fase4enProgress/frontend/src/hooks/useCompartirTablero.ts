import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useCompartirTablero = () => {
  return useMutation({
    mutationFn: async ({ boardId, email }: { boardId: string; email: string }) => {
      const res = await api.post(`/boards/${boardId}/share`, { email });
      return res.data;
    },
  });
};
