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

export type UserRole = 'owner' | 'editor' | 'reader' | 'EDITOR' | 'VIEWER';

// Tipo extendido que incluye los tipos que pueden venir del backend
export type BackendPermissionLevel = 'OWNER' | 'EDITOR' | 'VIEWER' | 'READ' | 'WRITE' | 'READER' | 'owner' | 'editor' | 'viewer' | 'reader';

// Función para normalizar los permisos del backend al frontend
export function normalizePermissionLevel(backendLevel: string): 'EDITOR' | 'VIEWER' {
  switch (backendLevel.toUpperCase()) {
    case 'EDITOR':
    case 'EDIT':
    case 'WRITE':
      return 'EDITOR';
    case 'VIEWER':
    case 'READ':
    case 'READER':
    case 'VIEW':
      return 'VIEWER';
    case 'OWNER':
      return 'EDITOR'; // Los owners tienen permisos de editor en la UI
    default:
      console.warn(`⚠️ Tipo de permiso desconocido: ${backendLevel}, usando VIEWER como fallback`);
      return 'VIEWER';
  }
}

// Función para convertir permisos del frontend al backend
export function frontendToBackendPermission(frontendLevel: 'EDITOR' | 'VIEWER'): 'EDITOR' | 'VIEWER' {
  // Como el backend ahora acepta EDITOR y VIEWER directamente, no necesitamos conversión
  return frontendLevel;
}

// Función para obtener el texto de display del permiso
export function getPermissionDisplayText(level: string): string {
  const normalized = normalizePermissionLevel(level);
  switch (normalized) {
    case 'EDITOR':
      return '✏️ Editor';
    case 'VIEWER':
      return '👁️ Solo lectura';
    default:
      return '🔧 Desconocido';
  }
}

// Función para obtener la descripción del permiso
export function getPermissionDescription(level: string): string {
  const normalized = normalizePermissionLevel(level);
  switch (normalized) {
    case 'EDITOR':
      return 'Puede ver, crear, editar y eliminar tareas';
    case 'VIEWER':
      return 'Solo puede ver el tablero y las tareas';
    default:
      return 'Permisos desconocidos';
  }
}

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
