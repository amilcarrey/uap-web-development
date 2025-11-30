// Align with backend Task model
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: number; // Assuming integer ID from backend
  boardId: number;
  title: string; // Changed from 'text'
  description?: string | null; // Optional description
  status: TaskStatus;
  dueDate?: string | null; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  // 'completed' boolean can be derived from status === 'done' if needed for UI
  // Or, if backend sends it, keep it. For now, relying on status.
}

// For creating a new task (some fields are optional or server-generated)
export interface NewTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: string; // Date string or Date object, to be stringified for API
}

// For updating an existing task
export type UpdateTaskPayload = Partial<NewTaskPayload & { status: TaskStatus }>; // status can be updated