import { PermissionLevel } from "../models/Permission";

export interface PermissionRequirement {
    boardId: number; 
    accessLevel: PermissionLevel
}
