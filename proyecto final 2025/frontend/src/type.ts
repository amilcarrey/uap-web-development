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
};

export type Filter = "all" | "done" | "undone";