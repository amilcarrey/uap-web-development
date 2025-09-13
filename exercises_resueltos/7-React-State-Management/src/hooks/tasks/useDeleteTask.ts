import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { toast } from "../../lib/toast";

export const useDeleteTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      toast.success("Task removed");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Could not remove task"),
  });
};