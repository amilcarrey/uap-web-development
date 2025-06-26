import { AccessLevel } from '../enum/access-level.enum';
// Usuario
export interface User {
  id: string;
  username: string;
  password_hash: string;
}

// Tablero
export interface Board {
  id: string;
  name: string;
  owner_id: string;
}

// Tarea
export interface Reminder {
  id: string;
  name: string;
  completed: boolean;
  board_id: string;
  created_by?: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// Permiso de usuario en tablero
export interface Permission {
  id: string;
  user_id: string;
  board_id: string;
  //access_level: "owner" | "full_access" | "viewer";
  access_level: AccessLevel; // Usando el enum aquí
  created_at: string;
  updated_at: string;
}


// Configuración del usuario
export interface UserSettings {
  user_id: string;
  refresh_interval: number;
  show_uppercase: boolean;
  task_page_size: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBoardRequest {
  name: string;
  owner_id: string;
}

export interface CreateReminderRequest {
  name: string;
  board_id: string;
  completed: boolean;
  created_by?: string;
  updated_by?: string;
}

export interface CreatePermissionRequest {
  user_id: string;                       // id del usuario al que le asignas el permiso
  board_id: string;                      // id del tablero sobre el que se concede acceso
  access_level: "owner" | "full_access" | "viewer";  // nivel de acceso
}

