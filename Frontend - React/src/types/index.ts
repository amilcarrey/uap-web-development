// Representa una tarea dentro de un tablero
export interface Task {
  id: number;
  title: string;
  content: string;
  completada: boolean;
  boardId: number;
}

// Representa un tablero donde se agrupan tareas
export interface Tablero {
  id: number;
  name: string;
  ownerId: number;
}