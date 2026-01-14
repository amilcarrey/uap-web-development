// Definición de tipo para una tarea
export type Task = {
  id: number;
  text: string;
  completed: boolean;
  categoriaId: string; 
};

// Lista de tareas
export let tasks: Task[] = [
  { id: 1, text: "Hacer la tarea", completed: false, categoriaId: "personal" },
  { id: 2, text: "Limpiar", completed: false, categoriaId: "familia" },
  { id: 3, text: "Hacer la compra", completed: true, categoriaId: "trabajo" },
  { id: 4, text: "Hacer la comida", completed: false, categoriaId: "personal" },
  { id: 5, text: "Hacer la cama", completed: false, categoriaId: "familia" },
  { id: 6, text: "Hacer ejercicio", completed: false, categoriaId: "salud" },
  { id: 7, text: "Leer un libro", completed: true, categoriaId: "personal" },
  { id: 8, text: "Estudiar programación", completed: false, categoriaId: "trabajo" },
  { id: 9, text: "Preparar la presentación", completed: false, categoriaId: "trabajo" },
  { id: 10, text: "Organizar el armario", completed: true, categoriaId: "personal" },
];

// Control de id incremental
let nextId = 11;

// Agregar tarea
export function addTask(text: string, categoriaId: string): void {
  tasks.push({ id: nextId++, text, completed: false, categoriaId });
}

// Eliminar tarea por id y categoría
export function deleteTask(id: number, categoriaId: string): void {
  tasks.splice(0, tasks.length, ...tasks.filter(task => task.id !== id || task.categoriaId !== categoriaId));
}

// Alternar estado de completado de una tarea por id y categoría
export function toggleTaskCompletion(id: number, categoriaId: string): void {
  tasks = tasks.map(task =>
    task.id === id && task.categoriaId === categoriaId
      ? { ...task, completed: !task.completed }
      : task
  );
}

// Eliminar todas las tareas completadas de una categoría
export function deleteCompletedTasks(categoriaId: string): void {
  tasks.splice(0, tasks.length, ...tasks.filter(task => !task.completed || task.categoriaId !== categoriaId));
}

export function editTask(id: number, text: string, categoriaId: string): void {
  tasks = tasks.map(task =>
    task.id === id && task.categoriaId === categoriaId
      ? { ...task, text }
      : task
  );}

// Listar tareas con opción de filtro por estado y categoría
export function listarTareas(
  filtro?: "completadas" | "pendientes",
  categoriaId?: string
): Task[] {
  let filteredTasks = tasks.filter(task => task.categoriaId === categoriaId);
  if (filtro === "completadas") return filteredTasks.filter(t => t.completed);
  if (filtro === "pendientes") return filteredTasks.filter(t => !t.completed);
  return filteredTasks;
};


export function listarTareasPaginadas(
  page: number,
  pageSize: number,
  categoriaId: string,
  filtro?: "completadas" | "pendientes",
): { tasks: Task[]; totalPages: number; currentPage: number; totalTasks: number } {
  const filtered = listarTareas(filtro, categoriaId, ); // Filtrar tareas por categoría y estado
  const totalTasks = filtered.length; // Total de tareas filtradas
  const totalPages = Math.max(1, Math.ceil(totalTasks / pageSize)); // Calcular total de páginas
  const paginatedTasks = filtered.slice((page - 1) * pageSize, page * pageSize); // Obtener tareas de la página actual

  return {
    tasks: paginatedTasks,
    totalPages,
    currentPage: page,
    totalTasks,
  };
}

