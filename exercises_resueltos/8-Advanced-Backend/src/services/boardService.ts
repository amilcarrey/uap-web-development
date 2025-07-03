import { api } from '../lib/api';
import { type User } from '../store/useAuthStore'; // Assuming User type is relevant for owner/members

// Define Board and Permission types based on backend responses
// These should align with your Swagger/JSDoc schema definitions

export interface BoardPermissionUser {
  id: number;
  username: string;
  email: string;
}
export interface BoardPermission {
  id: number;
  userId: number;
  boardId: number;
  permissionLevel: 'owner' | 'editor' | 'viewer';
  createdAt: string;
  updatedAt: string;
  user: BoardPermissionUser;
}

export interface Board {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
  owner?: BoardPermissionUser; // Optional: if backend sends owner details
  permissions?: BoardPermission[]; // Optional: if backend sends full permission list with board
  tasks?: any[]; // Define Task type later
  // Add other fields if your backend returns them (e.g., members array)
}

interface BoardsResponse {
  status: string;
  results?: number;
  data: {
    boards: Board[];
  };
}

interface SingleBoardResponse {
  status: string;
  data: {
    board: Board;
  };
}

interface CreateBoardPayload {
  name: string;
}

interface ShareBoardPayload {
  email: string; // Target user's email
  permissionLevel: 'editor' | 'viewer';
}

interface UpdatePermissionPayload {
  permissionLevel: 'editor' | 'viewer';
}

interface PermissionResponse {
    status: string;
    message?: string;
    data: {
      permission: BoardPermission;
    }
}

interface BoardPermissionsListResponse {
    status: string;
    results?: number;
    data: {
        permissions: BoardPermission[];
    }
}

// --- Board CRUD ---
export const getMyBoards = async (): Promise<Board[]> => {
  const response = await api.get<BoardsResponse>('/boards');
  return response.data.data.boards;
};

export const getBoardById = async (boardId: number): Promise<Board> => {
  const response = await api.get<SingleBoardResponse>(`/boards/${boardId}`);
  return response.data.data.board;
};

export const createBoard = async (payload: CreateBoardPayload): Promise<Board> => {
  const response = await api.post<SingleBoardResponse>('/boards', payload);
  return response.data.data.board;
};

export const updateBoard = async (boardId: number, payload: Partial<CreateBoardPayload>): Promise<Board> => {
  const response = await api.put<SingleBoardResponse>(`/boards/${boardId}`, payload);
  return response.data.data.board;
};

export const deleteBoard = async (boardId: number): Promise<void> => {
  await api.delete(`/boards/${boardId}`);
};

// --- Board Permissions Management ---
export const getBoardPermissionsList = async (boardId: number): Promise<BoardPermission[]> => {
    const response = await api.get<BoardPermissionsListResponse>(`/boards/${boardId}/permissions`);
    return response.data.data.permissions;
};

export const shareBoardWithUser = async (boardId: number, payload: ShareBoardPayload): Promise<BoardPermission> => {
  const response = await api.post<PermissionResponse>(`/boards/${boardId}/share`, payload);
  return response.data.data.permission;
};

export const updateUserBoardPermission = async (boardId: number, userIdToManage: number, payload: UpdatePermissionPayload): Promise<BoardPermission> => {
  const response = await api.put<PermissionResponse>(`/boards/${boardId}/permissions/${userIdToManage}`, payload);
  return response.data.data.permission;
};

export const removeUserFromBoardPermission = async (boardId: number, userIdToManage: number): Promise<void> => {
  await api.delete(`/boards/${boardId}/permissions/${userIdToManage}`);
};
