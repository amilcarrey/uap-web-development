import { prisma } from '../prisma';
import { CreateBoardDTO } from '../DTOs/board/CreateBoardSchema';
import { Board } from '../models/Board';
import { Permission, PermissionLevel } from '../models/Permission';
import { IBoardService } from '../Interfaces/IBoardService';
import { BoardDTO } from '../DTOs/board/BoardSchema';
import { UpdateBoardDTO } from '../DTOs/board/UpdateBoardSchema';
import { UserPermissionDTO } from '../DTOs/permission/UserPermissionSchema';
import { Task } from '../models/Task';
import { permission } from 'process';

export class BoardService implements IBoardService{
    async getBoardsForUser(userId: number): Promise<BoardDTO[]> {
        //Busco los tableros en donde el usuario es el dueño
        const ownedBoards = await prisma.board.findMany({
            where: {ownerId: userId},
            include: {tasks: true, permissions: true}
        });

        //Tableros en donde el usuario tienen permisos pero no es el dueño
        const permissionBoards = await prisma.board.findMany({
            where: {
                permissions: {
                    some: {userId}
                }
            },
            include: {tasks: true, permissions: true}
        });

        //Unifico y elimino tableros duplicados (en el caso de que sea dueño y tenga permisos)
        const allBoards = [...ownedBoards, ...permissionBoards]
            .filter((board, index, self) =>
                index === self.findIndex(b => b.id === board.id)
            );

        //Devuelvo el DTO
        return allBoards.map(board => ({
            name: board.name,
            active: board.active,
            ownerId : board.ownerId,
            tasks: board.tasks,
            permissionsId: board.permissions.map(P => P.id)
        }));

    }

    async getBoardById(boardId: number): Promise<BoardDTO | null> {
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: { tasks: true, permissions: true }
        });

        if(!board){return null}

        return {
            name: board.name,
            active: board.active,
            ownerId: board.ownerId,
            tasks: board.tasks,
            permissionsId: board.permissions.map(p => p.id)
        };
    }
    
    async updateBoard(boardId: number, data: UpdateBoardDTO): Promise<BoardDTO> {
        // Implementa la lógica para actualizar un tablero
        // 1. Buscar el tablero por ID
        const board = await this.getBoardById(boardId);
        if(!board){
            throw new Error("Tablero no encontrado");
        }

        // 2. Actualizar los campos recibidos en `data`
        await prisma.board.update({
            where : {id: boardId},
            data:{
                name: data.name ?? board.name,
            }
        });

        // 3. Retornar el BoardDTO actualizado
        const updatedBoard = await this.getBoardById(boardId);
        if (!updatedBoard) {
            throw new Error("Error retrieving updated board");
        }
        return updatedBoard;

    }
    
    async deleteBoard(userId: number, boardId: number): Promise<void> {
        //1. Verifico si el tablero existe
        const board = await prisma.board.findUnique({
            where: {id: boardId}
        });

        if(!board){
            throw new Error('Tablero no encontrado');
        }

        //2. Verifico si el usuario es el dueño
        if(board.ownerId !== userId){
            throw new Error('No tienes permiso para eliminar este tablero');
        }

        //3. Elimino primero las tareas asociadas (si existen)
        await prisma.task.deleteMany({
            where: {boardId}
        });

        //4. Elimino los permisos asociados al tablero
        await prisma.boardPermission.deleteMany({
            where: {boardId}
        });

        //5. Elimino el tablero
        await prisma.board.delete({
            where: {id: boardId}
        });
    }
    
    shareBoard(boardId: number, targetUserId: number, accessLevel: 'read' | 'edit' | 'owner'): Promise<void> {
        throw new Error('Method not implemented.');
    }
    getBoardPermissions(boardId: number): Promise<UserPermissionDTO[]> {
        // Implementa la lógica para obtener los permisos de un tablero
        // Ejemplo:
        // 1. Buscar todos los permisos asociados al boardId
        // 2. Mapearlos a UserPermissionDTO[]
        throw new Error('Method not implemented.');
    }

    async createBoard(userId: number, data: CreateBoardDTO): Promise<BoardDTO> {
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
                level: PermissionLevel.OWNER,
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
        return this.mapToBoardDTO(boardWithRelations);
    }

    /**
     * Convierte el objeto plano de la base de datos en una instancia de Board.
     * 
     * Al crear un tablero, tasks será un array vacío porque no hay tareas asociadas aún.
     * permissions tendrá solo el permiso OWNER para el usuario creador.
     */
    private mapToBoardDTO(board: any): BoardDTO {
        return{
            name: board.name,
            active: board.active,
            ownerId: board.ownerId,
            tasks: board.tasks ? board.tasks.map((task: any) => ({
                content: task.content,
                active: task.active,
                boardId: task.boardId
            })) : [],
            permissionsId: board.permissions ? board.permissions.map((perm: any) => perm.id) : [],
        };
    }
}