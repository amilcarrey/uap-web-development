export interface Task {
  id: string;
  content: string;
  active: boolean;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface TasksResponse {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateTaskRequest {
  content: string;
  active?: boolean;
}

export interface UpdateTaskRequest {
  content?: string;
  active?: boolean;
  action?: "toggle" | "edit" | "delete";
}

export type TaskFilter = "all" | "active" | "completed";

export interface TaskSearchRequest {
  query: string;
  boardId: string;
  filter?: TaskFilter;
  page?: number;
  limit?: number;
}
