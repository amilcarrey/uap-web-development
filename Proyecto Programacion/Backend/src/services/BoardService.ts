import { prisma } from '../prisma';
import { CreateBoardDTO } from '../DTOs/board/CreateBoardDTO';
import { Board } from '../models/Board';
import { Permission, PermissionLevel } from '../models/Permission';
import { IBoardService } from '../Interfaces/IBoardService';
import { BoardDTO } from '../DTOs/board/BoardDTO';
import { updateBoardDTO } from '../DTOs/board/updateBoardDTO';
import { UserPermissionDTO } from '../DTOs/permission/UserPermissionDTO';

export class BoardService implements IBoardService{
    getBoardsForUser(userId: number): Promise<BoardDTO[]> {
        throw new Error('Method not implemented.');
    }
    getBoardById(userId: number, boardId: number): Promise<BoardDTO> {
        throw new Error('Method not implemented.');
    }
    updateBoard(boardId: number, data: updateBoardDTO): Promise<BoardDTO> {
        throw new Error('Method not implemented.');
    }
    deleteBoard(userId: number, boardId: number): Promise<void> {
        throw new Error('Method not implemented.');
    }
    shareBoard(boardId: number, targetUserId: number, accessLevel: 'read' | 'edit' | 'owner'): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getBoardPermissions(boardId: number): Promise<UserPermissionDTO[]> {
        throw new Error('Method not implemented.');
    }

    async createBoard(userId: number, data: CreateBoardDTO): Promise<Board> {
        // 1. Crear el tablero (sin tareas asociadas)
        const board = await prisma.board.create({
            data: {
                name: data.name,
                active: data.active,
                ownerId: userId,
            },
        });

        // 2. Crear el permiso OWNER para el usuario creador
        await prisma.boardPermission.create({
            data: {
                userId: userId,
                boardId: board.id,
                level: 'OWNER',
            },
        });

        // 3. Consultar el tablero con tareas y permisos (tasks estará vacío)
        const boardWithRelations = await prisma.board.findUnique({
            where: { id: board.id },
            include: {
                tasks: true,
                permissions: true,
            },
        });

        // 4. Mapear a modelo de dominio
        return this.mapToBoard(boardWithRelations);
    }

    /**
     * Convierte el objeto plano de la base de datos en una instancia de Board.
     * 
     * Al crear un tablero, tasks será un array vacío porque no hay tareas asociadas aún.
     * permissions tendrá solo el permiso OWNER para el usuario creador.
     */
    private mapToBoard(board: any): Board {
        const permissions = board.permissions.map(
            (p: any) => new Permission(
                p.id,
                p.userId,
                p.boardId,
                p.level as PermissionLevel
            )
        );

        return new Board(
            board.id,
            board.name,
            board.active,
            board.ownerId,
            [], // tasks: array vacío porque el tablero recién creado no tiene tareas
            permissions
        );
    }
}