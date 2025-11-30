import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Task } from "../../types/task";
import { toast } from "../../lib/toast";

export const useClearCompleted = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get<Task[]>("/tasks", { params: { completed: true } });
      await Promise.all(data.filter((t) => t.completed).map((t) => api.delete(`/tasks/${t.id}`)));
    },
    onSuccess: () => {
      toast.success("Completed tasks cleared");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Could not clear tasks"),
  });
};