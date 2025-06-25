export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

const boards: Record<string, Task[]> = {};

export function getTasks(boardId: string): Task[] {
  return boards[boardId] || [];
}

export function addTask(boardId: string, text: string): Task {
  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    completed: false
  };
  if (!boards[boardId]) boards[boardId] = [];
  boards[boardId].push(newTask);
  return newTask;
}

export function updateTask(boardId: string, id: string, completed: boolean): Task | undefined {
  const task = boards[boardId]?.find(t => t.id === id);
  if (task) task.completed = completed;
  return task;
}

export function deleteTask(boardId: string, id: string): void {
  boards[boardId] = boards[boardId]?.filter(t => t.id !== id) || [];
}
