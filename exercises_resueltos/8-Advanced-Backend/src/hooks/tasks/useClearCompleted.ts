import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import { toastSuccess, toastError } from "../../lib/toast";

interface ClearCompletedVariables {
  boardId: number; // For invalidating the correct query and for the API call
}

interface ClearCompletedResponse { // As defined in task.controller.js for this route
    status: string;
    message: string;
    data: {
      deletedCount: number;
    }
}

export const useClearCompletedTasks = () => { // Renamed for clarity
  const queryClient = useQueryClient();
  return useMutation<ClearCompletedResponse, Error, ClearCompletedVariables>({
    mutationFn: async ({ boardId }) => {
      if (!boardId) throw new Error("Board ID is required to clear completed tasks.");
      // Backend endpoint: DELETE /boards/:boardId/tasks/completed
      const response = await api.delete<ClearCompletedResponse>(`/boards/${boardId}/tasks/completed`);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data.data.deletedCount > 0) {
        toastSuccess(`${data.data.deletedCount} completed task(s) cleared successfully!`);
      } else {
        toastSuccess("No completed tasks to clear.");
      }
      // Invalidate queries for the specific board's tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.boardId] });
    },
    onError: (error: Error) => {
      toastError(error.message || "Could not clear completed tasks. Please try again.");
    },
  });
};