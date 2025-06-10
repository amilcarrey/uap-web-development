export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type Board = {
  id: string;
  name: string;
  description: string;
};

export type Filter = "all" | "done" | "undone";