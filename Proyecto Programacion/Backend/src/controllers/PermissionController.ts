import {Request, Response} from 'express';
import {PermissionService} from '../services/PermissionService';
import {PermissionLevel} from '@prisma/client';

const permissionService = new PermissionService();

export class PermissionController {
    
    // Otorga permisos de un tablero
    static async grantPermission(req:Request, res: Response){
        const boardId = Number(req.params.boardId);
        const {userId, level} = req.body;
        const currentUserId = Number((req as any).user?.id);

        if (isNaN(boardId) || !userId) {
            const error = new Error("ID de tablero o usuario inválido");
            (error as any).status = 400;
            throw error;
        }
        if(!Object.values(PermissionLevel).includes(level)){
            const error = new Error("Nivel de permiso inválido");
            (error as any).status = 400;
            throw error;
        }

        await permissionService.grantPermission(boardId, userId, level, currentUserId);
        res.status(200).json({message: "Permiso otorgado correctamente"});
    };

    // Revoca permisos de un tablero
    static async revokePermission(req: Request, res: Response){
        const boardId = Number(req.params.boardId);
        const userId = Number(req.params.userId);
        const currentUserId = Number((req as any).user?.id);

        if (isNaN(boardId) || isNaN(userId)) {
            const error = new Error("ID de tablero o usuario inválido");
            (error as any).status = 400;
            throw error;
        }

        await permissionService.revokePermission(boardId, userId, currentUserId);
        res.status(200).json({message: "Permiso revocado correctamente"});
    }

    // Obtiene permisos de un tablero
    static async getBoardPermissions(req: Request, res: Response){
        const boardId = Number(req.params.boardId);
        if (isNaN(boardId)) {
            const error = new Error("ID de tablero inválido");
            (error as any).status = 400;
            throw error;
        }
        const permissions = await permissionService.getBoardPermissions(boardId);
        res.status(200).json(permissions);
    }

    // Actualiza permisos de un tablero
    static async updatePermission(req: Request, res: Response){
        const boardId = Number(req.params.boardId);
        const userId = Number(req.params.userId);
        const {newLevel} = req.body;
        const currentUserId = Number((req as any).user?.id);

        if (isNaN(boardId) || isNaN(userId)) {
            const error = new Error("ID de tablero o usuario inválido");
            (error as any).status = 400;
            throw error;
        }
        if(!Object.values(PermissionLevel).includes(newLevel)){
            const error = new Error("Nivel de permiso inválido");
            (error as any).status = 400;
            throw error;
        }

        await permissionService.updatePermission(boardId, userId, newLevel, currentUserId);
        res.status(200).json({message: "Permiso actualizado correctamente"});
    }
}