import { PermissionLevel } from "../models/Permission";

export interface IPermissionService {
    grantPermission(boardId: number, userId: number, level: PermissionLevel, currentUserId: number): Promise<void>;
    revokePermission(boardId: number, userId: number, currentUserId?: number): Promise<void>;
    revokePermissionById(boardId: number, permissionId: number, currentUserId?: number): Promise<void>;
    getBoardPermissions(boardId: number): Promise<void>;
    updatePermission(boardId: number, userId: number, newLevel: PermissionLevel, currentUserId?: number): Promise<void>;
}


