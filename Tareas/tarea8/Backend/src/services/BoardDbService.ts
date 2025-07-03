import { prisma } from '../prisma';
import { CreateBoardDTO } from '../DTOs/board/CreateBoardSchema';
import { Permission, PermissionLevel } from '../models/Permission';
import { IBoardService } from '../Interfaces/IBoardService';
import { BoardDTO } from '../DTOs/board/BoardSchema';
import { UpdateBoardDTO } from '../DTOs/board/UpdateBoardSchema';

export class BoardService implements IBoardService{
    
    async getBoards(): Promise<BoardDTO[]> {
        const boards = await prisma.board.findMany({
            include: {
                tasks: true,
                permissions: true
            }
        });

        return boards.map((board: any) => this.mapToBoardDTO(board));
    }

    
    async getBoardsForUser(userId: number): Promise<BoardDTO[]> {
        const ownedBoards = await prisma.board.findMany({
            where: {ownerId: userId},
            include: {tasks: true, permissions: true}
        });

        const permissionBoards = await prisma.board.findMany({
            where: {
                permissions: {
                    some: {userId}
                }
            },
            include: {tasks: true, permissions: true}
        });

        const allBoards = [...ownedBoards, ...permissionBoards]
            .filter((board, index, self) =>
                index === self.findIndex(b => b.id === board.id)
            )
            
            .filter((board: any) => {
                
                if (board.ownerId === userId) {
                    return true;
                }
                
                return board.permissions.some((perm: any) => perm.userId === userId);
            });

        return allBoards.map((board: any) => this.mapToBoardDTO(board, userId));
    }

    
    async getBoardById(boardId: number): Promise<BoardDTO | null> {
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: { tasks: true, permissions: true }
        });

        if(!board){
            const error = new Error("Tablero no encontrado");
            (error as any).status = 404;
            throw error;
        }

        return this.mapToBoardDTO(board);
    }
    
    
    async updateBoard(boardId: number, data: UpdateBoardDTO): Promise<BoardDTO> {
        const board = await this.getBoardById(boardId);
        

        if(!board){
            const error = new Error("Tablero no encontrado"); 
            (error as any).status = 404;
            throw error;
        }

        await prisma.board.update({
            where : {id: boardId},
            data:{
                name: data.name ?? board.name,
            }
        });

        const updatedBoard = await this.getBoardById(boardId);

        if(!updatedBoard){
            const error = new Error("Tablero no encontrado después de actualizar");
            (error as any).status = 500;
            throw error;
        }

        return updatedBoard;
    }
    
    
    async deleteBoard(userId: number, boardId: number): Promise<void> {
        const board = await prisma.board.findUnique({
            where: {id: boardId}
        });

        if(!board){
            const error = new Error('Tablero no encontrado');
            (error as any).status = 404;
            throw error;
        }

        if(board.ownerId !== userId){
            const error = new Error('No tienes permiso para eliminar este tablero');
            (error as any).status = 403;
            throw error;
        }

        await prisma.task.deleteMany({
            where: {boardId}
        });

        await prisma.permission.deleteMany({
            where: {boardId}
        });

        await prisma.board.delete({
            where: {id: boardId}
        });
    }
    

    
    async createBoard(userId: number, data: CreateBoardDTO): Promise<BoardDTO> {
        const board = await prisma.board.create({
            data: {
                name: data.name,
                ownerId: userId,
            },
        });

        await prisma.permission.create({
            data: {
                userId: userId,
                boardId: board.id,
                level: PermissionLevel.OWNER,
            },
        });

        const boardWithRelations = await prisma.board.findUnique({
            where: { id: board.id },
            include: {
                tasks: true,
                permissions: true,
            },
        });

        if (!boardWithRelations) {
            const error = new Error("Tablero no encontrado después de crearlo");
            (error as any).status = 500;
            throw error;
        }

        return this.mapToBoardDTO(boardWithRelations, userId);
    }

    private mapToBoardDTO(board: any, userId?: number): BoardDTO {
        
        let userRole: "OWNER" | "EDITOR" | "VIEWER" = "VIEWER";
        
        if (userId !== undefined) {
            if (board.ownerId === userId) {
                userRole = "OWNER";
            } else {
                
                const userPermission = board.permissions ? board.permissions.find((perm: any) => perm.userId === userId) : null;
                userRole = userPermission ? userPermission.level : "VIEWER";
            }
        }

        return{
            id: board.id,
            name: board.name,
            ownerId: board.ownerId,
            tasks: board.tasks ? board.tasks.map((task: any) => ({
                id: task.id,
                content: task.content,
                active: task.active,
                boardId: task.boardId
            })) : [],
            permissionsId: board.permissions ? board.permissions.map((perm: any) => perm.id) : [],
            userRole: userRole
        };
    }
}
