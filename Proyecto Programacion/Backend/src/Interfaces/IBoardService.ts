import { CreateBoardDTO } from '../DTOs/board/CreateBoardDTO';
import {Board} from '../models/Board';
import {BoardDTO} from '../DTOs/board/BoardDTO';
import { updateBoardDTO } from '../DTOs/board/updateBoardDTO';
import { UserPermissionDTO } from '../DTOs/permission/UserPermissionDTO';


export interface IBoardService{
    
    createBoard(userId: number, data: CreateBoardDTO): Promise<Board>;
    getBoardsForUser(userId: number): Promise<BoardDTO[]>;
    getBoardById(userId: number, boardId: number): Promise<BoardDTO>;
    updateBoard(boardId: number, data: updateBoardDTO): Promise<BoardDTO>;
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