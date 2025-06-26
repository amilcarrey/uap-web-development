import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Task {
  id: string;
  description: string;
  completed: boolean;
  boardId: string;
  createdAt: string;
}


export interface BoardPermission {
  id: string;
  userId: string;
  boardId: string;
  role: 'owner' | 'editor' | 'viewer';
}

export type DateTime = string;

export interface Board {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
}


const fetchBoards = async (): Promise<Board[]> => {
  const res = await fetch('/api/boards', { credentials: 'include' });
  if (!res.ok) throw new Error('Error al obtener tableros');
  return res.json();
};

export interface UserPreferences {
  id: string;
  userId: string;
  refreshInterval: number;
  capitalizeTasks: boolean;
}


interface CreateBoardData {
  title: string;
}

const createBoard = async (data: CreateBoardData): Promise<Board> => {
  const res = await fetch('/api/boards', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al crear tablero');
  }
  return res.json();
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards'] });
    },
  });
};
