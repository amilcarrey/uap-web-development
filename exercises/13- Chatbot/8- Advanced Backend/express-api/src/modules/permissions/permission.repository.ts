import database from "../../db/connection";
import { BoardPermission, User, Board } from "../../types";

export class PermissionRepository {
    // Obtener permiso especifico de un usuario en un tablero
    getBoardPermission(boardId: number, userId: number): Promise<BoardPermission | undefined> {
        return database.get<BoardPermission>(
            `SELECT * FROM board_permissions 
            WHERE board_id = ? AND user_id = ?`,
            [boardId, userId]
        );
    }

    // Obtener todos los permisios de un tablero (con info del usuario)
    async getBoardPermissions(boardId: number): Promise<(BoardPermission & { user: User })[]> {
        return database.all<BoardPermission & { user: User }>(
            `SELECT bp.*, u.id as user_id, u.username, u.email 
            FROM board_permissions bp
            JOIN users u ON bp.user_id = u.id
            WHERE bp.board_id = ?`,
            [boardId]
        );
    }

    // Obtener todos los tableros donde el usuario tiene permisos
    async getUserBoardPermissions(userId: number): Promise<(BoardPermission & { board: Board })[]> {
        const results = await database.all<{
            id: number;
            board_id: number;
            user_id: number;
            permission_level: 'owner' | 'editor' | 'viewer';
            created_at: string;
            updated_at: string;
            board_name: string;
            board_owner_id: number;
            board_created_at: string;
            board_updated_at: string;
        }>(
            `SELECT 
                bp.id,
                bp.board_id,
                bp.user_id,
                bp.permission_level,
                bp.created_at,
                bp.updated_at,
                b.name as board_name,
                b.owner_id as board_owner_id,
                b.created_at as board_created_at,
                b.updated_at as board_updated_at
            FROM board_permissions bp
            JOIN boards b ON bp.board_id = b.id
            WHERE bp.user_id = ?
            ORDER BY b.name ASC`,
            [userId]
        );

        // Mapear los resultados para incluir el objeto board anidado
        return results.map(row => ({
            id: row.id,
            board_id: row.board_id,
            user_id: row.user_id,
            permission_level: row.permission_level,
            created_at: row.created_at,
            updated_at: row.updated_at,
            board: {
                id: row.board_id,
                name: row.board_name,
                owner_id: row.board_owner_id,
                created_at: row.board_created_at,
                updated_at: row.board_updated_at
            }
        }));
    }

    // Crear un nuevo permiso para un tablero
    async createBoardPermission(boardId: number, userId: number, permissionLevel: 'owner' | 'editor' | 'viewer'): Promise<BoardPermission> {
        await database.run(
            `INSERT INTO board_permissions (board_id, user_id, permission_level, created_at) 
            VALUES (?, ?, ?, datetime('now'))`,
            [boardId, userId, permissionLevel]
        );

        const permission = await this.getBoardPermission(boardId, userId);
        if (!permission) {
            throw new Error('Failed to create board permission');
        }

        // Obtener el permiso recién creado
        return permission;
    }

    // Actualizar un permiso existente
    async updateBoardPermission(boardId: number, userId: number, permissionLevel: 'editor' | 'viewer'): Promise<BoardPermission> {
        // No permitir cambiar permisos de owner
        const currentPermission = await this.getBoardPermission(boardId, userId);
        if (currentPermission?.permission_level === 'owner') {
            throw new Error('Cannot change owner permissions');
        }

        await database.run(
            `UPDATE board_permissions 
            SET permission_level = ?, updated_at = datetime('now') 
            WHERE board_id = ? AND user_id = ?`,
            [permissionLevel, boardId, userId]
        );

        // Verificar si se actualizó correctamente
        const permission = await this.getBoardPermission(boardId, userId);
        if (!permission) {
            throw new Error('Failed to update board permission');
        }
        
        return permission;
    }

    // Eliminar un permiso de un tablero
    async deleteBoardPermission(boardId: number, userId: number): Promise<boolean> {
        await database.run(
            `DELETE FROM board_permissions 
            WHERE board_id = ? AND user_id = ?`,
            [boardId, userId]
        );

        // Verificar si se eliminó correctamente
        const permission = await this.getBoardPermission(boardId, userId);
        if (permission) {
            throw new Error('Failed to delete board permission');
        }

        return true;
    }

    // Verificar si un usuario tiene un nivel específico de permiso
    async userHasPermission(boardId: number, userId: number, requiredLevel: 'owner' | 'editor' | 'viewer'): Promise<boolean> {
        const permission = await this.getBoardPermission(boardId, userId);
        if  (!permission) return false; // No tiene ningún permiso

        // Jerarquia owner > editor > viewer
        const levels = { 'owner': 3, 'editor': 2, 'viewer': 1 };
        const userLevel = levels[permission.permission_level as keyof typeof levels];
        const requiredLevelValue = levels[requiredLevel];

        return userLevel >= requiredLevelValue; // Si el usuario tiene un nivel igual o superior al requerido
    }

    // Verificar si un usuario es owner de un tablero
    async isBoardOwner(boardId: number, userId: number): Promise<boolean> {
        const permission = await this.getBoardPermission(boardId, userId);
        return permission?.permission_level === 'owner';
    }

    // Verificar si un usuario es editor de un tablero
    async isBoardEditor(boardId: number, userId: number): Promise<boolean> {
        const permission = await this.getBoardPermission(boardId, userId);
        return permission?.permission_level === 'editor';
    }

    // Verificar si un usuario es viewer de un tablero
    async isBoardViewer(boardId: number, userId: number): Promise<boolean> {
        const permission = await this.getBoardPermission(boardId, userId);
        return permission?.permission_level === 'viewer';
    }
}