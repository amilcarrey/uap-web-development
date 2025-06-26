import {Board, CreateBoardRequest} from "../../types";
import {BoardRepository} from "./board.repository";
import {database} from "../../db/connection";

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
    // Verifica que el requester sea owner del board (puede ser el owner_id en la tabla boards o tener permisos de owner)
    const board = await database.get(
      "SELECT * FROM boards WHERE id = ? AND owner_id = ?",
      [boardId, ownerId]
    );
    
    if (!board) {
      // Si no es el owner directo, verifica si tiene permisos de owner
      const ownerPermission = await database.get(
        "SELECT * FROM permissions WHERE board_id = ? AND user_id = ? AND access_level = 'owner'",
        [boardId, ownerId]
      );
      if (!ownerPermission) {
        throw new Error("No tienes permisos para invitar usuarios");
      }
    }

    // Verifica que el usuario a invitar no tenga ya permisos en este board
    const existingPermission = await database.get(
      "SELECT * FROM permissions WHERE board_id = ? AND user_id = ?",
      [boardId, userId]
    );
    
    if (existingPermission) {
      throw new Error("El usuario ya tiene permisos en este board");
    }

    // Invita al usuario usando el repositorio
    await this.boardRepository.inviteUserToBoard(boardId, userId, accessLevel);
  }}