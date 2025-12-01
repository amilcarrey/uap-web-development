import { Request, Response } from 'express';
import { PermissionsService } from './permission.service';
import { ShareBoardDto } from '../../types';

export class PermissionController {
    constructor(private permissionsService: PermissionsService) {}

    // Compartir tablero con otro usuario -- POST /api/boards/:boardId/share
    shareBoard = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            const shareData: ShareBoardDto = req.body;
            const ownerId = req.user!.id; 

            // Validar entradas
            if (!shareData.email || !shareData.permission_level) { 
                res.status(400).json({ error: 'Email and permission level are required' });
                return;
            }
            
            const permission = await this.permissionsService.shareBoard(boardId, shareData, ownerId,);
            res.status(201).json(permission);
        } catch (error) {
            console.error('Error sharing board:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to share board' });
            }
        }
    }

    // Obtener permisos de un tablero -- GET /api/boards/:boardId/permissions
    getBoardPermissions = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId)
            const userId = req.user!.id;

            const permissions = await this.permissionsService.getBoardPermissions(boardId, userId);
            res.status(200).json(permissions);
        } catch (error) {  
            console.error('Error getting board permissions:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to get board permissions' });
            }
        }
    }

    //  Actualizar permisos de un tablero -- PUT /api/boards/:boardId/permissions/:userId
    updatePermission = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            const userId = parseInt(req.params.userId);
            const requesterId = req.user!.id;
            const { permission_level } = req.body;

            if(!permission_level || !['editor', 'viewer'].includes(permission_level)) {
                res.status(400).json({ error: 'Invalid permission level' });
                return;
            }

            const updatedPermission = await this.permissionsService.updatePermission(boardId, userId, permission_level,requesterId );
            res.status(200).json(updatedPermission);

        } catch (error) {
            console.error('Error updating permission:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to update permission' });
            }
        }
    }

    // Eliminar permiso de un tablero -- DELETE /api/boards/:boardId/permissions/:userId
    deletePermission = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = parseInt(req.params.boardId);
            const userId = parseInt(req.params.userId);
            const requesterId = req.user!.id;

            await this.permissionsService.removePermission(boardId, userId, requesterId);
            res.status(204).send();
        } catch (error) {
            console.error('Error deleting permission:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to delete permission' });
            }
        }
    }

    // obtener los permisos y los tableros de un usuario -- GET /api/user/boards
    getUserBoards = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user!.id;
            const boards = await this.permissionsService.getUserBoards(userId);
            res.json(boards);
        } catch (error) {
            console.error('Error getting user boards:', error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Failed to get user boards' });
            }
        }
    }
}