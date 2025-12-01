import { PermissionRepository } from "./permission.repository";
import { AuthRepository } from "../auth/auth.repository";
import { BoardPermission, ShareBoardDto, User, Board } from "../../types";

export class PermissionsService {
    constructor(
        private permissionRepository: PermissionRepository,
        private authRepository: AuthRepository
    ) {}

    // Compartir tablero con otro usuario
    async shareBoard(boardId: number, shareData: ShareBoardDto, ownerId: number): Promise<BoardPermission> {
        // Verificar que el que comparte sea owner
        const isOwner = await this.permissionRepository.isBoardOwner(boardId, ownerId);
        if (!isOwner) {
            throw new Error('Only the owner can share the board');
        }
        
        // Verificar que el usuario existe
        const user = await this.authRepository.getUserByEmail(shareData.email);
        if (!user) {
            throw new Error('User not found');
        }

        // No permitir compartir consigo mismo
        if (user.id === ownerId) {
            throw new Error('Cannot share board with yourself');
        }

        // Verificar si ya existe un permiso para este usuario en el tablero
        const existingPermission = await this.permissionRepository.getBoardPermission(boardId, user.id);

        if (existingPermission) {
            if (existingPermission.permission_level === shareData.permission_level) {
                throw new Error('User already has this permission level on the board');
            }

            // Actualizar permiso existente
            return await this.permissionRepository.updateBoardPermission(boardId, user.id, shareData.permission_level);
        } else { // si no existe un permiso del usuario para el board
            return await this.permissionRepository.createBoardPermission(boardId, user.id, shareData.permission_level);
        }
    }

    // Obtener permisos de un tablero
    async getBoardPermissions(boardId: number, requesterId: number): Promise<Array<BoardPermission & { user: User}>> {
        // Verificar que el usuario tiene acceso al tablero
        const canAccess = await this.permissionRepository.userHasPermission(boardId, requesterId, 'viewer');
        if (!canAccess) {
            throw new Error('Access denied');
        }

        // Obtener permisos del tablero
        return this.permissionRepository.getBoardPermissions(boardId);
    }

    // Actualizar permisos de un usuario en un tablero (solo owner)
    async updatePermission(boardId: number, userId: number, permissionLevel: 'editor' | 'viewer', requesterId: number): Promise<BoardPermission> {
        // Verificar que el usuario sea owner del tablero
        const isOwner = await this.permissionRepository.isBoardOwner(boardId, requesterId);
        if (!isOwner) {
            throw new Error('Only board owners can change permissions');
        }

        return this.permissionRepository.updateBoardPermission(boardId, userId, permissionLevel);
    }

    // Remover permisos de un usuario (solo owner)
    async removePermission(boardId: number, userId: number, requesterId: number): Promise<boolean> {
        // Verificar que el usuario sea owner del tablero
        const isOwner = await this.permissionRepository.isBoardOwner(boardId, requesterId);
        if (!isOwner) {
            throw new Error('Only board owners can remove permissions');
        }

        // No permitir remover permisos del propio owner
        if (userId === requesterId) {
            throw new Error('Cannot remove your own permissions');
        }

        return this.permissionRepository.deleteBoardPermission(boardId, userId);
    } 

    // Obtener tableros donde el usuario tiene permisos 
    async getUserBoards(userId: number): Promise<(BoardPermission & { board: Board })[]> {
        return this.permissionRepository.getUserBoardPermissions(userId);
    }

    // Verificar si un usuario tiene acceso a un tablero
    async checkPermission(boardId: number, userId: number, permissionLevel: 'owner' | 'editor' | 'viewer'): Promise<boolean> {
        return this.permissionRepository.userHasPermission(boardId, userId, permissionLevel);
    }
}