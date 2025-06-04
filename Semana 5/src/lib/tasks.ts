export type Task = {
  id: string;
  text: string;
  done: boolean;
  boardId: string;
};
  
export let tasks: Task[] = [];

let nextId = 1;

export function generateId() {
  return String(nextId++);
}