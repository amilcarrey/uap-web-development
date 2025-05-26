import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Task } from "../../types/task";
import { toast } from "../../lib/toast";

export const useAddTask = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      const newTask: Omit<Task, "id"> = { text, completed: false };
      const { data } = await api.post<Task>("/tasks", newTask);
      return data;
    },
    onSuccess: () => {
      toast.success("Task added");
      qc.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Could not add task"),
  });
};