// src/types/permissions.ts - COMPLETAR
export interface Permission {
  id: string;
  userId: string;
  boardId: string;
  role: 'owner' | 'editor' | 'reader';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
  email?: string;
}

// NUEVAS INTERFACES NECESARIAS:
export interface BoardPermission {
  user: User;
  role: 'owner' | 'editor' | 'reader';
  grantedAt: string;
}

export type UserRole = 'owner' | 'editor' | 'reader';

// Interface para respuestas de búsqueda de usuarios
export interface UserSearchResult {
  users: User[];
  total: number;
}

// Interface para respuesta al compartir tablero
export interface ShareBoardResponse {
  message: string;
  permission: Permission;
}