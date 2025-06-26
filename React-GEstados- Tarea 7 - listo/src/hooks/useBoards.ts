// src/hooks/useBoards.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBoards, createBoard, deleteBoard } from "../api";

export const useBoards = () => {
  return useQuery({
    queryKey: ["boards"],
    queryFn: fetchBoards,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};