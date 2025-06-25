export type Task = {
  id: string;
  name: string;
  completed: boolean;
};
export type TaskFilter = "all" | "completed" | "incompleted";

export type Board = {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type BoardUser = {
  user_id: string;  // <-- Cambiado de id a user_id
  name?: string;
  email: string;
  role: "owner" | "editor" | "viewer";
};