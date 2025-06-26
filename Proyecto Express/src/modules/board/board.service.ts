import { Board, CreateBoardRequest } from "../../types";
import { BoardRepository } from "./board.repository";

export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async getAllBoards(userId: string): Promise<Board[]> {
    return this.boardRepository.getBoardsByUserId(userId);
  }

  async getBoardById(id: string): Promise<Board | undefined> {
    return this.boardRepository.getBoardById(id);
  }

  async createBoard(boardData: CreateBoardRequest,userId:string, customId?: string): Promise<Board> {
    const board = await this.boardRepository.createBoard(boardData, customId);
    await this.boardRepository.addUserToBoard(userId, board.id, "owner");
    return board;
  }

  async deleteBoard(id: string): Promise<boolean> {
    return this.boardRepository.deleteBoard(id);
  }

  async boardExists(id: string): Promise<boolean> {
    return this.boardRepository.boardExists(id);
  }

  async addUserToBoard(userId: string, boardId: string, role: string): Promise<void> {
    console.log(`Adding user ${userId} to board ${boardId} with role ${role}`);
    await this.boardRepository.addUserToBoard(userId, boardId, role);
  }
}