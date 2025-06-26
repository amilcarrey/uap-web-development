export type Task = {
  id: string;
  text: string;
  completed: boolean;
  boardId: number;
  created_at: string;
  updated_at: string;
};


export type Board = {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
};


export type BoardPermission = {
  board_id: string;
  user_id: string;
  role: "owner" | "editor" | "viewer";
};

export type Filter = "all" | "done" | "undone";