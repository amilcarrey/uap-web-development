import { PermissionLevel } from "../../models/Permission";

export interface UserPermissionDTO {
    userId: number; // ID del usuario al que se le asignan los permisos
    boardId: number; // ID del tablero al que se le asignan los permisos
    levelAccess: PermissionLevel; // Nivel de acceso del usuario al tablero
}