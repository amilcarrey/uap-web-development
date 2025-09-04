import { CreateBoardDTO } from '../DTOs/board/CreateBoardSchema';
import {BoardDTO} from '../DTOs/board/BoardSchema';
import { UpdateBoardDTO } from '../DTOs/board/UpdateBoardSchema';


export interface IBoardService{
    
    createBoard(userId: number, data: CreateBoardDTO): Promise<BoardDTO>;
    getBoardsForUser(userId: number): Promise<BoardDTO[]>;
    getBoardById(boardId: number): Promise<BoardDTO | null>;
    updateBoard(boardId: number, data: UpdateBoardDTO): Promise<BoardDTO>;
    deleteBoard(userId: number, boardId: number): Promise<void>;

}
