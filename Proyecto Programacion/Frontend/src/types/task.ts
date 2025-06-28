export interface Task {
  id: string;
  content: string; // Contenido de la tarea (compatible con el backend)
  active: boolean; // true = completada, false = pendiente (compatible con el backend)
  boardId: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string; // Para futuras funcionalidades
}

// Para respuestas del API con paginación
export interface TasksResponse {
  items: Task[];
  total: number;
  page: number;
  pageSize: number;
}

// Para crear una nueva tarea
export interface CreateTaskRequest {
  content: string;
  active?: boolean; // Por defecto false
}

// Para actualizar una tarea
export interface UpdateTaskRequest {
  content?: string;
  active?: boolean;
  action?: 'toggle' | 'edit' | 'delete';
}

// Para filtros de tareas
export type TaskFilter = 'all' | 'active' | 'completed';

// Para búsqueda de tareas
export interface TaskSearchRequest {
  query: string;
  boardId: string;
  filter?: TaskFilter;
  page?: number;
  limit?: number;
}