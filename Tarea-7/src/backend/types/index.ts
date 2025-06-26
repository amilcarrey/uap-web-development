export interface Tablero {
  id: string;
  nombre: string;
  ownerId: string;
  created_at: string;
  updated_at: string;
}

export interface Tarea {
  id: number;
  content: string;
  completed: boolean;
  tableroId: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTableroRequest {
  nombre: string;
}

export interface CreateTareaRequest {
  content: string;
  tableroId: string;
}

export interface UpdateTareaRequest {
  id: number;
  content?: string;
  completed?: boolean;
  tableroId?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}


export type PermissionLevel = "propietario" | "editor" | "lector";

export interface Permission {
  id: string;
  tableroId: string;
  usuarioId: string;
  nivel: PermissionLevel;
}


export interface CreatePermissionRequest {
  tableroId: string;
  usuarioId: string;
  nivel: PermissionLevel;
}
