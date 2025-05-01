// src/lib/tareas.js

let tasks = [
    { id: '1', name: 'Estudiar Astro', completed: false },
    { id: '2', name: 'Hacer ejercicio', completed: true },
  ];
  
  export function getTasks() {
    return tasks;
  }
  
  export function addTask(name) {
    const newTask = {
      id: crypto.randomUUID(),
      name,
      completed: false,
    };
    tasks.push(newTask);
  }
  
  export function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = !task.completed;
  }
  
  export function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
  }
  
  export function clearCompleted() {
    tasks = tasks.filter(t => !t.completed);
  }
  