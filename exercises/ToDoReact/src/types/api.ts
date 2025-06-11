// API Types that match the backend structure
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Board {
  id: string;
  name: string;
  owner_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  text: string;
  completed: number; // Backend uses 0/1 instead of boolean
  board_id: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BackendTasksResponse {
  items: Task[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    startItem: number;
    endItem: number;
    offset: number;
  };
  totalCount: number;
}

// Legacy Task interface for backward compatibility with existing components
export interface LegacyTask {
  id: string; // Changed to string to match backend UUID
  text: string;
  completed: boolean;
}

// Legacy TasksResponse for backward compatibility
export interface LegacyTasksResponse {
  tasks: LegacyTask[];
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
}

// Transform functions to convert between backend and frontend formats
export const transformTaskToLegacy = (task: Task): LegacyTask => ({
  id: task.id, // Keep original UUID string
  text: task.text,
  completed: task.completed === 1,
});

export const transformPaginationToLegacy = (
  pagination: BackendTasksResponse["pagination"]
): LegacyTasksResponse["pagination"] => ({
  currentPage: pagination.currentPage,
  totalPages: pagination.totalPages,
  totalItems: pagination.totalItems,
  itemsPerPage: pagination.itemsPerPage,
  hasNextPage: pagination.hasNextPage,
  hasPrevPage: pagination.hasPrevPage,
  startItem: pagination.startItem,
  endItem: pagination.endItem,
});
