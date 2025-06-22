import {Request, Response} from 'express';
import {PermissionService} from '../services/PermissionService';
import {PermissionLevel} from '@prisma/client';

const permissionService = new PermissionService();

export class PermissionController {
    
    //Otorga permisos de un tablero
    static async grantPermission(req:Request, res: Response){
        const boardId = Number(req.params.boardId);
        const {userId, level} = req.body;
        const currentUserId = Number((req as any).user?.id);

        if(!Object.values(PermissionLevel).includes(level)){
            res.status(400).json({error: "Nivel de permiso inválido"});
            return;
        }

        await permissionService.grantPermission(boardId, userId, level, currentUserId);
        res.status(200).json({message: "Permiso otorgado correctamente"});
    };

    //Revoca permisos de un tablero
    static async revokePermission(req: Request, res: Response){
        const boardId = Number(req.params.boardId);
        const userId = Number(req.params.userId);
        const currentUserId = Number((req as any).user?.id);

        await permissionService.revokePermission(boardId, userId, currentUserId);
        res.status(200).json({message: "Permiso revocado correctamente"});
    }

    //Obtiene permisos de un tablero
    static async getBoardPermissions(req: Request, res: Response){
        const boardId = Number(req.params.boardId);
        const permissions = await permissionService.getBoardPermissions(boardId);
        res.status(200).json(permissions);
    }

    //Actualiza permisos de un tablero
    static async updatePermission(req: Request, res: Response){
        const boardId = Number(req.params.boardId);
        const userId = Number(req.params.userId);
        const {newLevel} = req.body;
        const currentUserId = Number((req as any).user?.id);

        if(!Object.values(PermissionLevel).includes(newLevel)){
            res.status(400).json({error: "Nivel de permiso inválido"});
            return;
        }

        await permissionService.updatePermission(boardId, userId, newLevel, currentUserId);
        res.status(200).json({message: "Permiso actualizado correctamente"});
    }
}