import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost, apiPut, apiDelete } from "../lib/api";
import { useNotifications } from "../store/clientStore";
import type { ApiResponse, Board, PaginatedResponse } from "../types/api";

export const boardKeys = {
  all: ["boards"] as const,
  lists: () => [...boardKeys.all, "list"] as const,
  list: (page: number) => [...boardKeys.lists(), { page }] as const,
  detail: (id: string) => [...boardKeys.all, "detail", id] as const,
};

// API Functions
const fetchBoards = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Board>> => {
  return apiGet<PaginatedResponse<Board>>(
    `/api/boards?page=${page}&limit=${limit}`
  );
};

const createBoard = async (data: {
  name: string;
}): Promise<ApiResponse<Board>> => {
  return apiPost<ApiResponse<Board>>("/api/boards", data);
};

const updateBoard = async (data: {
  id: string;
  name: string;
}): Promise<ApiResponse<Board>> => {
  return apiPut<ApiResponse<Board>>(`/api/boards/${data.id}`, {
    name: data.name,
  });
};

const deleteBoard = async (
  id: string
): Promise<ApiResponse<{ message: string }>> => {
  return apiDelete<ApiResponse<{ message: string }>>(`/api/boards/${id}`);
};

// Custom Hooks
export const useBoards = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: boardKeys.list(page),
    queryFn: () => fetchBoards(page, limit),
    staleTime: 30 * 1000,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: createBoard,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      showSuccess("Board created!", `Created "${response.data.name}" board`);
    },
    onError: (error: Error) => {
      showError("Failed to create board", error.message);
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: updateBoard,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: boardKeys.detail(response.data.id),
      });
      showSuccess("Board updated!", `Updated to "${response.data.name}"`);
    },
    onError: (error: Error) => {
      showError("Failed to update board", error.message);
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotifications();

  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
      showSuccess("Board deleted!", "Board has been removed");
    },
    onError: (error: Error) => {
      showError("Failed to delete board", error.message);
    },
  });
};
