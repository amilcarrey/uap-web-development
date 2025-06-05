export interface Task {
  id: number;
  description: string;
  completed: boolean;
  boardId: string;
  optimistic?: boolean;
}
