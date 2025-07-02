import {Request, Response} from 'express';
import {PermissionService} from '../services/PermissionService';
import {PermissionLevel} from '../models/Permission';

const permissionService = new PermissionService();

// Helper function para normalizar niveles de permisos (acepta mayúsculas y minúsculas)
function normalizePermissionLevel(level: string): PermissionLevel | null {
    if (!level || typeof level !== 'string') return null;
    
    const upperLevel = level.toUpperCase();
    
    // Verificar si el valor normalizado es válido
    if (Object.values(PermissionLevel).includes(upperLevel as PermissionLevel)) {
        return upperLevel as PermissionLevel;
    }
    
    return null;
}

export class PermissionController {
    
    // Otorga permisos de un tablero
    static async grantPermission(req:Request, res: Response){
        const boardId = Number(req.params.boardId);
        const {userId, level, permissionLevel} = req.body;
        const currentUserId = Number((req as any).user?.id);

        // Aceptar tanto 'level' como 'permissionLevel' para compatibilidad
        const rawPermLevel = level || permissionLevel;
        const permLevel = normalizePermissionLevel(rawPermLevel);
        
        console.log("ID TABLERO: ", boardId);
        console.log("ID USUARIO: ", userId);
        console.log("NIVEL ORIGINAL: ", rawPermLevel);
        console.log("NIVEL NORMALIZADO: ", permLevel);
        
        if (isNaN(boardId) || !userId) {
            const error = new Error("ID de tablero o usuario inválido");
            (error as any).status = 400;
            throw error;
        }
        if(!permLevel){
            const error = new Error(`Nivel de permiso inválido. Valores válidos: ${Object.values(PermissionLevel).join(', ')}`);
            (error as any).status = 400;
            throw error;
        }

        await permissionService.grantPermission(boardId, userId, permLevel, currentUserId);
        res.status(200).json({message: "Permiso otorgado correctamente"});
    };

    // Revoca permisos de un tablero por userId
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

    // Revoca permisos de un tablero por permissionId
    static async revokePermissionById(req: Request, res: Response){
        const boardId = Number(req.params.boardId);
        const permissionId = Number(req.params.permissionId);
        const currentUserId = Number((req as any).user?.id);

        if (isNaN(boardId) || isNaN(permissionId)) {
            const error = new Error("ID de tablero o permiso inválido");
            (error as any).status = 400;
            throw error;
        }

        await permissionService.revokePermissionById(boardId, permissionId, currentUserId);
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

        // Normalizar el nivel de permiso para aceptar mayúsculas y minúsculas
        const normalizedLevel = normalizePermissionLevel(newLevel);

        if (isNaN(boardId) || isNaN(userId)) {
            const error = new Error("ID de tablero o usuario inválido");
            (error as any).status = 400;
            throw error;
        }
        if(!normalizedLevel){
            const error = new Error(`Nivel de permiso inválido. Valores válidos: ${Object.values(PermissionLevel).join(', ')}`);
            (error as any).status = 400;
            throw error;
        }

        await permissionService.updatePermission(boardId, userId, normalizedLevel, currentUserId);
        res.status(200).json({message: "Permiso actualizado correctamente"});
    }
}