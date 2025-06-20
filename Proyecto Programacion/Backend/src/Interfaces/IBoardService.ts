import { CreateBoardDTO } from '../DTOs/board/CreateBoardSchema';
import {Board} from '../models/Board';
import {BoardDTO} from '../DTOs/board/BoardSchema';
import { UpdateBoardDTO } from '../DTOs/board/UpdateBoardSchema';
import { UserPermissionDTO } from '../DTOs/permission/UserPermissionSchema';


export interface IBoardService{
    
    createBoard(userId: number, data: CreateBoardDTO): Promise<BoardDTO>;
    getBoardsForUser(userId: number): Promise<BoardDTO[]>;
    getBoardById(boardId: number): Promise<BoardDTO | null>;
    updateBoard(boardId: number, data: UpdateBoardDTO): Promise<BoardDTO>;
    deleteBoard(userId: number, boardId: number): Promise<void>;
    shareBoard(boardId: number, targetUserId: number, accessLevel: 'read' | 'edit' | 'owner'): Promise<void>;
    getBoardPermissions(boardId: number): Promise<UserPermissionDTO[]>;
}


/*

createBoard(userId: string, data: CreateBoardDto): Promise<Board>
getBoardsForUser(userId: string): Promise<BoardDto[]>
getBoardById(userId: string, boardId: string): Promise<BoardDto>
updateBoard(boardId: string, data: UpdateBoardDto): Promise<BoardDto>
deleteBoard(userId: string, boardId: string): Promise<void>
shareBoard(boardId: string, targetUserId: string, accessLevel: 'read' | 'edit' | 'owner'): Promise<void>
getBoardPermissions(boardId: string): Promise<UserPermissionDto[]>

*/