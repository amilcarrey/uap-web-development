import { PermissionLevel } from "../models/Permission";

export interface PermissionRequirement {
    boardId: number; // ID del tablero al que se aplica el requisito de permiso
    accessLevel: PermissionLevel
}