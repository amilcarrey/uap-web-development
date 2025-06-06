export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

export type Filter = "all" | "done" | "undone";