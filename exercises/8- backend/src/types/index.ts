// User interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "password_hash">;
  token: string;
}

// Board interfaces (equivalent to tabs in ToDoReact)
export interface Board {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBoardRequest {
  name: string;
  description?: string;
}

export interface UpdateBoardRequest {
  name?: string;
  description?: string;
}

// Board Permission interfaces
export interface BoardPermission {
  id: string;
  board_id: string;
  user_id: string;
  permission_level: "owner" | "editor" | "viewer";
  created_at: string;
}

export interface ShareBoardRequest {
  user_email: string;
  permission_level: "editor" | "viewer";
}

// Task interfaces (based on ToDoReact Task interface)
export interface Task {
  id: string;
  board_id: string;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  text: string;
  board_id: string;
}

export interface UpdateTaskRequest {
  text?: string;
  completed?: boolean;
}

// Pagination interfaces (based on ToDoReact pagination)
export interface PaginationParams {
  page: number;
  limit: number;
  filter?: "all" | "active" | "completed";
  search?: string;
}

export interface PaginationResponse<T = any> {
  items: T;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startItem: number;
    endItem: number;
  };
  totalCount: number;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: PaginationResponse;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface ErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

// Request extensions for authentication
declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, "password_hash">;
    }
  }
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}
