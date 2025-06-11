import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../lib/api";
import type { ApiResponse, Board } from "../types/api";

// Helper hook to map tab names to board IDs
export const useBoardMapping = () => {
  const { data: boardsResponse } = useQuery({
    queryKey: ["boards"],
    queryFn: () => apiGet<ApiResponse<Board[]>>("/api/boards"),
    staleTime: 30 * 1000,
  });

  const boards = boardsResponse?.data || [];

  const getFirstBoardId = (): string | null => {
    return boards[0]?.id || null;
  };

  const getBoardIdByName = (name: string): string | null => {
    if (!boards.length) return null;
    const board = boards.find(
      (board) => board.name.toLowerCase() === name.toLowerCase()
    );
    return board?.id || null;
  };

  const getBoardNameById = (id: string): string | null => {
    if (!boards.length) return null;
    const board = boards.find((board) => board.id === id);
    return board?.name || null;
  };

  return {
    boards,
    getFirstBoardId,
    getBoardIdByName,
    getBoardNameById,
  };
};
