export interface IPermissionService {
    grantPermission(boardId: number, userId: number, accessLevel: 'read' | 'edit'): Promise<void>;
    revokePermmission(boardId: number, userId: number): Promise<void>;
    updatePerission(boardId: number, userId: number, newLevelAccess: 'read' | 'edit'): Promise<void>;
    getUsserPermissionForBoard(boardId: number, userId: number): Promise<'none' | 'read' | 'edit' | 'owner'>
}


/* 
grantPermission(boardId: string, userId: string, accessLevel: 'read' | 'edit'): Promise<void>
revokePermission(boardId: string, userId: string): Promise<void>
updatePermission(boardId: string, userId: string, newLevel: 'read' | 'edit'): Promise<void>
getUserPermissionForBoard(boardId: string, userId: string): Promise<'none' | 'read' | 'edit' | 'owner'>
*/