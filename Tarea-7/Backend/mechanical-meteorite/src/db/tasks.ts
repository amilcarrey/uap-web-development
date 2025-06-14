export type Task = {
  id: string;
  text: string;
  completed: boolean;
};

let tasks: Task[] = [];

export function getTasks(): Task[] {
  return tasks;
}

export function addTask(text: string): Task {
  const newTask: Task = {
    id: crypto.randomUUID(),
    text,
    completed: false
  };
  tasks.push(newTask);
  return newTask;
}

export function updateTask(id: string, completed: boolean): Task | undefined {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = completed;
  return task;
}

export function deleteTask(id: string): void {
  tasks = tasks.filter(t => t.id !== id);
}
