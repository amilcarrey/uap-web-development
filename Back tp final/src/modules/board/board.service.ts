import {Board, CreateBoardRequest} from "../../types";
import {BoardRepository} from "./board.repository";
import {database} from "../../db/connection"; // Asegúrate de que la ruta sea correcta

export class BoardService {
  constructor(private readonly boardRepository: BoardRepository) {}

  async getAllBoards(): Promise<Board[]> {
    // Here we can implement some business logic
    //console.log('Donde estan mis boardddssss');
    return this.boardRepository.getAllBoards();
 
  }
async getBoardsByUserId(user_id: string): Promise<any[]> {
  return this.boardRepository.getBoardsByUserId(user_id);
}

  async getBoardById(id: string): Promise<Board | undefined> {
    return this.boardRepository.getBoardById(id);
  }

  async createBoard(boardData: CreateBoardRequest): Promise<Board> {
    // Here we can implement some business logic like validation, etc.
    return this.boardRepository.createBoard(boardData);
  }

  async deleteBoard(id: string): Promise<boolean> {
    return this.boardRepository.deleteBoard(id);
  }

  async boardExists(id: string): Promise<boolean> {
    return this.boardRepository.boardExists(id);
  }
  async inviteUserToBoard(ownerId: string, userId: string, boardId: string, accessLevel: string) {
    // Verifica que el requester sea owner del board
    const owner = await database.get(
      "SELECT * FROM permissions WHERE board_id = ? AND user_id = ? AND access_level = 'owner'",
      [boardId, ownerId]
    );
    if (!owner) throw new Error("No tienes permisos para invitar usuarios");
}}