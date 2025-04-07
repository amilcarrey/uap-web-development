type Task = {
  id: number;
  text: string;
  completed: boolean;
};

let tasks: Task[] = [];
let currentId = 1;

export function getTasks(filter: string): Task[] {
  if (filter === 'complete') return tasks.filter(t => t.completed);
  if (filter === 'incomplete') return tasks.filter(t => !t.completed);
  return tasks;
}

export function addTask(text: string) {
  tasks.push({ id: currentId++, text, completed: false });
}

export function toggleTask(id: number) {
  const task = tasks.find(t => t.id === id);
  if (task) task.completed = !task.completed;
}

export function deleteTask(id: number) {
  tasks = tasks.filter(t => t.id !== id);
}

export function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
}
