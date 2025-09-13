import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Task, NewTaskPayload } from "../../types/task"; // Updated types
import { toastSuccess, toastError } from "../../lib/toast"; // Consistent toast imports

interface AddTaskVariables {
  boardId: number;
  taskData: NewTaskPayload;
}

export const useAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, AddTaskVariables>({
    mutationFn: async ({ boardId, taskData }) => {
      if (!boardId) throw new Error("Board ID is required to add a task.");
      // Backend endpoint: POST /boards/:boardId/tasks
      const response = await api.post<Task>(`/boards/${boardId}/tasks`, taskData);
      return response.data; // Assuming backend returns the created task directly (not nested under data.task)
                               // If it's nested: return response.data.data.task
    },
    onSuccess: (data, variables) => { // data is the new task, variables include boardId
      toastSuccess("Task added successfully!");
      // Invalidate queries for the specific board's tasks to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.boardId] });
    },
    onError: (error: Error) => {
      toastError(error.message || "Could not add task. Please try again.");
    },
  });
};