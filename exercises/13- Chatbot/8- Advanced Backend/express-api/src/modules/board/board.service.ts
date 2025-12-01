import { BoardRepository } from "./board.repository";
import { Board, MutateBoardDto, User } from "../../types";

export class BoardService {
    constructor(private boardRepository: BoardRepository) {}

    async getAllBoards(owner_id: number): Promise<Board[]> {
        return this.boardRepository.getAllBoards(owner_id);
    }

    async getBoardById(id: number): Promise<Board | undefined> {
        return this.boardRepository.getBoardById(id);
    }

    async createBoard(data: MutateBoardDto, owner_id: number): Promise<Board> {
        return this.boardRepository.createBoard(data, owner_id);
    }

    async updateBoard(id: number, data: MutateBoardDto): Promise<Board | undefined> {
        return this.boardRepository.updateBoard(id, data);
    }

    async deleteBoard(id: number): Promise<boolean> {
        return this.boardRepository.deleteBoard(id);
    }    
    
    async canAccessBoard(boardId: number, userId: number): Promise<boolean> {
        return this.boardRepository.canAccessBoard(boardId, userId);
    }

    async boardExists(boardId: number): Promise<boolean> {
        return this.boardRepository.boardExists(boardId);
    }

    async getBoardOwner(boardId: number): Promise<User | undefined> {
        return this.boardRepository.getBoardOwner(boardId);
    }
}