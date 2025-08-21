import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api";
import type { Task, UpdateTaskPayload } from "../../types/task"; // Updated types
import { toastSuccess, toastError } from "../../lib/toast";

interface UpdateTaskVariables {
  boardId: number; // For invalidating the correct query
  taskId: number;
  taskData: UpdateTaskPayload;
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<Task, Error, UpdateTaskVariables>({
    mutationFn: async ({ boardId, taskId, taskData }) => {
      if (!boardId || !taskId) throw new Error("Board ID and Task ID are required.");
      // Backend endpoint: PUT /boards/:boardId/tasks/:taskId
      const response = await api.put<Task>(`/boards/${boardId}/tasks/${taskId}`, taskData);
      // Assuming backend returns the updated task directly or nested under data.task
      // For example, if it's { status: 'success', data: { task: ... } }
      // then return response.data.data.task;
      // For now, let's assume it's response.data (if backend returns task directly on PUT)
      // or response.data.data.task if it is nested
      // My backend controller for updateTask returns { status: 'success', data: { task: updatedTask } }
      // So, if `api.put` is set up to return `response.data` which is the above object,
      // then we need `response.data.data.task`.
      // However, typically axios `response.data` refers to the actual JSON body.
      // Let's assume `response.data` is the task object itself for now, or adjust if backend structure differs.
      // If the backend returns { status, data: { task } }, then it should be response.data.data.task.
      // The task controller returns: res.status(200).json({ status: 'success', data: { task: updatedTask } });
      // So, it should be response.data.data.task
       if (response.data && (response.data as any).data && (response.data as any).data.task) {
        return (response.data as any).data.task;
      }
      return response.data; // Fallback if structure is flatter
    },
    onSuccess: (data, variables) => {
      toastSuccess("Task updated successfully!");
      // Invalidate queries for the specific board's tasks
      queryClient.invalidateQueries({ queryKey: ["tasks", variables.boardId] });
    },
    onError: (error: Error) => {
      toastError(error.message || "Could not update task. Please try again.");
    },
  });
};