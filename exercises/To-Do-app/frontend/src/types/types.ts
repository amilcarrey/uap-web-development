export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Board {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
  boardId: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardUser {
  userId: number;
  boardId: number;
  role: 'owner' | 'editor' | 'viewer';
  user: User;
}