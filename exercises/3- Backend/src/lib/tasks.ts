// Definición de tipo para una tarea
export type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// Lista de tareas
export let tasks: Task[] = [
  { id: 1, text: "Hacer la tarea", completed: false },
  { id: 2, text: "Limpiar", completed: false },
  { id: 3, text: "Hacer la compra", completed: true },
  { id: 4, text: "Hacer la comida", completed: false },
  { id: 5, text: "Hacer la cama", completed: false },
];

// Control de id incremental
let nextId = 6;

// Agregar tarea
export function addTask(text: string): void {
  tasks.push({ id: nextId++, text, completed: false });
}

// Eliminar tarea por id
export function deleteTask(id: number): void {
  tasks.splice(0, tasks.length, ...tasks.filter(task => task.id !== id));
}

// Alternar estado de completado de una tarea por id
export function toggleTaskCompletion(id: number): void {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

// Eliminar todas las tareas completadas
export function deleteCompletedTasks(): void {
  tasks.splice(0, tasks.length, ...tasks.filter(task => !task.completed));
}

// Listar tareas con opción de filtro por estado
export function listarTareas(filtro?: "completadas" | "pendientes"): Task[] {
  if (filtro === "completadas") return tasks.filter(t => t.completed);
  if (filtro === "pendientes") return tasks.filter(t => !t.completed);
  return tasks;
}



