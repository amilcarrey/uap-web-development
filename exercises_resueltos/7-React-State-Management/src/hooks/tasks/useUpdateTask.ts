import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Task } from "../../types/task";
import { toast } from "../../lib/toast";

export const useUpdateTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (task: Task) => {
      const { data } = await api.patch<Task>(`/tasks/${task.id}`, task);
      return data;
    },
    onSuccess: () => {
      toast.success("Task updated");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Could not update task"),
  });
};