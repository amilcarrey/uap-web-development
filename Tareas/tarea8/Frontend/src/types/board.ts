import type { UserRole } from "./permissions";

export interface Board {
  id: string;
  name: string;
  ownerId: string;
  userRole?: UserRole;
  createdAt: string;
  updatedAt: string;
  taskCount?: number;
  sharedCount?: number;
}

export interface BoardsResponse {
  boards: Board[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateBoardRequest {
  name: string;
}

export interface UpdateBoardRequest {
  name?: string;
  action?: "rename" | "delete";
}
