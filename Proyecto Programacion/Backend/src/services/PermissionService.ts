import {prisma} from '../prisma';
import {Permission} from '../models/Permission';
import { IPermissionService } from '../Interfaces/IPermissionService';
import { PermissionLevel } from '@prisma/client';

export class PermissionService implements IPermissionService {

    async grantPermission(boardId: number, userId: number, level: PermissionLevel, currentUserId: number): Promise<void> {
        
        const board = await prisma.board.findUnique({where: {id: boardId}});
        if(!board) throw new Error("Tablero no encontrado");
        if(currentUserId && board.ownerId !== currentUserId) throw new Error("Solo el propietario del tablero puede otorgar permisos");
        if(userId === currentUserId) throw new Error("No puedes otorgarte permisos a ti mismo");
        
        const user = await prisma.user.findUnique({where: {id: userId}});
        if(!user) throw new Error("Usuario no encontrado");

        await prisma.permission.upsert({
            where: { userId_boardId: { userId, boardId } },
            update: { level },
            create: { userId, boardId, level }
        });
    }
    
    async revokePermission(boardId: number, userId: number, currentUserId?: number): Promise<void> {
        
        const board = await prisma.board.findUnique({ where: { id: boardId } });

        if (!board) throw new Error('Tablero no encontrado');
        if (currentUserId && board.ownerId !== currentUserId) throw new Error('Solo el dueño puede revocar permisos');
        if (userId === board.ownerId) throw new Error('No puedes revocar permisos al dueño del tablero');
        
        await prisma.permission.deleteMany({
            where: {boardId, userId},
        });
    }
    async getBoardPermissions(boardId: number): Promise<any> {
        return prisma.permission.findMany({
            where: {boardId},
            include: {user: true}
        });
    }
    async updatePermission(boardId: number, userId: number, newLevel: PermissionLevel, currentUserId?: number): Promise<void> {
        
        const board = await prisma.board.findUnique({ where: { id: boardId } });

        if (!board) throw new Error('Tablero no encontrado');
        if (currentUserId && board.ownerId !== currentUserId) throw new Error('Solo el dueño puede actualizar permisos');
        if (userId === board.ownerId && newLevel !== PermissionLevel.OWNER) throw new Error('No puedes cambiar el nivel de permiso del dueño del tablero');
        
        await prisma.permission.update({
            where: {userId_boardId: { userId, boardId }},
            data: { level: newLevel }
        });
    }

}