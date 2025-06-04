export type Task = {
  id: string;
  name: string;
  completed: boolean;
};
export type TaskFilter = "all" | "completed" | "incompleted";