import type { UserRole } from './permissions';

export interface Board {
  id: string;
  name: string;
  ownerId: string;
  userRole?: UserRole; // Rol del usuario actual en este tablero
  createdAt: string;
  updatedAt: string;
  taskCount?: number; // Número total de tareas en el tablero
  sharedCount?: number; // Número de usuarios con acceso
}

// Para respuestas del API que incluyen metadatos
export interface BoardsResponse {
  boards: Board[];
  total: number;
  page: number;
  pageSize: number;
}

// Para crear un nuevo tablero
export interface CreateBoardRequest {
  name: string;
}

// Para actualizar un tablero
export interface UpdateBoardRequest {
  name?: string;
  action?: 'rename' | 'delete';
}