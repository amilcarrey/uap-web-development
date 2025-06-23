import {prisma} from '../prisma';
import {Permission} from '../models/Permission';
import { IPermissionService } from '../Interfaces/IPermissionService';
import { PermissionLevel } from '@prisma/client';

export class PermissionService implements IPermissionService {

    async grantPermission(boardId: number, userId: number, level: PermissionLevel, currentUserId: number): Promise<void> {
        const board = await prisma.board.findUnique({where: {id: boardId}});
        if(!board) {
            const error = new Error("Tablero no encontrado");
            (error as any).status = 404;
            throw error;
        }
        if(currentUserId && board.ownerId !== currentUserId) {
            const error = new Error("Solo el propietario del tablero puede otorgar permisos");
            (error as any).status = 403;
            throw error;
        }
        if(userId === currentUserId) {
            const error = new Error("No puedes otorgarte permisos a ti mismo");
            (error as any).status = 400;
            throw error;
        }
        const user = await prisma.user.findUnique({where: {id: userId}});
        if(!user) {
            const error = new Error("Usuario no encontrado");
            (error as any).status = 404;
            throw error;
        }

        await prisma.permission.upsert({
            where: { userId_boardId: { userId, boardId } },
            update: { level },
            create: { userId, boardId, level }
        });
    }
    
    async revokePermission(boardId: number, userId: number, currentUserId?: number): Promise<void> {
        const board = await prisma.board.findUnique({ where: { id: boardId } });
        if (!board) {
            const error = new Error('Tablero no encontrado');
            (error as any).status = 404;
            throw error;
        }
        if (currentUserId && board.ownerId !== currentUserId) {
            const error = new Error('Solo el dueño puede revocar permisos');
            (error as any).status = 403;
            throw error;
        }
        if (userId === board.ownerId) {
            const error = new Error('No puedes revocar permisos al dueño del tablero');
            (error as any).status = 400;
            throw error;
        }
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
        if (!board) {
            const error = new Error('Tablero no encontrado');
            (error as any).status = 404;
            throw error;
        }
        if (currentUserId && board.ownerId !== currentUserId) {
            const error = new Error('Solo el dueño puede actualizar permisos');
            (error as any).status = 403;
            throw error;
        }
        if (userId === board.ownerId && newLevel !== PermissionLevel.OWNER) {
            const error = new Error('No puedes cambiar el nivel de permiso del dueño del tablero');
            (error as any).status = 400;
            throw error;
        }
        await prisma.permission.update({
            where: {userId_boardId: { userId, boardId }},
            data: { level: newLevel }
        });
    }
}