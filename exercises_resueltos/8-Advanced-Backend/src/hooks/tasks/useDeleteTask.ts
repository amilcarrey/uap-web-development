import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { toastSuccess, toastError } from "../../lib/toast";

interface DeleteTaskVariables {
  boardId: number; // For invalidating the correct query
  taskId: number;
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, DeleteTaskVariables>({
    mutationFn: async ({ boardId, taskId }) => {
      if (!boardId || !taskId) throw new Error("Board ID and Task ID are required.");
      // Backend endpoint: DELETE /boards/:boardId/tasks/:taskId
      await api.delete(`/boards/${boardId}/tasks/${taskId}`);
    },
    onSuccess: (data, variables) => {
      toastSuccess("Task deleted successfully!");
      // Invalidate queries for the specific board's tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.boardId] });
    },
    onError: (error: Error) => {
      toastError(error.message || "Could not delete task. Please try again.");
    },
  });
};