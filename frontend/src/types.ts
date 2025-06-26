export type Task = {
  id: string;
  description: string;
  completed: boolean;
  boardId: string;
};

export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type Board = {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
};

export type BoardPermission = {
  id: string;
  userId: string;
  boardId: string;
  role: 'owner' | 'editor' | 'viewer';
};

export type UserPreferences = {
  id: string;
  userId: string;
  refreshInterval: number;
  capitalizeTasks: boolean;
};
