
let tasks = [];
let idCounter = 1;

export function getTasks(filter = 'all') {
  if (filter === 'all') {
    return tasks;
  }
  return tasks.filter(task => task.status === filter);
}

export function addTask(description) {
  const newTask = {
    id: idCounter++,
    description,
    status: 'incomplete'
  };
  tasks.push(newTask);
  return newTask;
}

export function updateTask(id, status) {
  const task = tasks.find(t => t.id === id);
  if (task && (status === 'complete' || status === 'incomplete')) {
    task.status = status;
    return task;
  }
  return null;
}

export function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
}

export function clearCompleted() {
  tasks = tasks.filter(t => t.status !== 'complete');
}
