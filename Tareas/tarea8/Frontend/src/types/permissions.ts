export interface Permission {
  id: string;
  userId: string;
  boardId: string;
  role: "owner" | "editor" | "reader";
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

export interface BoardPermission {
  user: User;
  role: "owner" | "editor" | "reader";
  grantedAt: string;
}

export type UserRole =
  | "owner"
  | "editor"
  | "reader"
  | "viewer"
  | "OWNER"
  | "EDITOR"
  | "VIEWER";

export type BackendPermissionLevel =
  | "OWNER"
  | "EDITOR"
  | "VIEWER"
  | "READ"
  | "WRITE"
  | "READER"
  | "owner"
  | "editor"
  | "viewer"
  | "reader";

export function normalizePermissionLevel(
  backendLevel: string
): "EDITOR" | "VIEWER" {
  switch (backendLevel.toUpperCase()) {
    case "EDITOR":
    case "EDIT":
    case "WRITE":
      return "EDITOR";
    case "VIEWER":
    case "READ":
    case "READER":
    case "VIEW":
      return "VIEWER";
    case "OWNER":
      return "EDITOR";
    default:
      console.warn(
        `⚠️ Tipo de permiso desconocido: ${backendLevel}, usando VIEWER como fallback`
      );
      return "VIEWER";
  }
}

export function frontendToBackendPermission(
  frontendLevel: "EDITOR" | "VIEWER"
): "EDITOR" | "VIEWER" {
  return frontendLevel;
}

export function getPermissionDisplayText(level: string): string {
  if (level && level.toUpperCase() === "OWNER") {
    return "Propietario";
  }

  const normalized = normalizePermissionLevel(level);
  switch (normalized) {
    case "EDITOR":
      return "Editor";
    case "VIEWER":
      return "Solo lectura";
    default:
      return "Desconocido";
  }
}

export function getPermissionDescription(level: string): string {
  const normalized = normalizePermissionLevel(level);
  switch (normalized) {
    case "EDITOR":
      return "Puede ver, crear, editar y eliminar tareas";
    case "VIEWER":
      return "Solo puede ver el tablero y las tareas";
    default:
      return "Permisos desconocidos";
  }
}

export interface UserSearchResult {
  users: User[];
  total: number;
}

export interface ShareBoardResponse {
  message: string;
  permission: Permission;
}
