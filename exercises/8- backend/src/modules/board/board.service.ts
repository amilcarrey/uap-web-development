import {
  Board,
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardPermission,
} from "../../types";
import { BoardRepository } from "./board.repository";
import { PermissionService } from "../permission/permission.service";

export class BoardService {
  private permissionService = new PermissionService();

  constructor(private readonly boardRepository: BoardRepository) {}

  async getAllBoardsByUser(userId: string): Promise<Board[]> {
    // Use the permission service to get boards with permissions
    return this.permissionService.getUserBoards(userId);
  }

  async getBoardById(id: string, userId: string): Promise<Board | undefined> {
    return this.boardRepository.getBoardById(id, userId);
  }

  async createBoard(
    boardData: CreateBoardRequest,
    ownerId: string
  ): Promise<Board> {
    return this.boardRepository.createBoard(boardData, ownerId);
  }

  async updateBoard(
    id: string,
    boardData: UpdateBoardRequest,
    userId: string
  ): Promise<Board | undefined> {
    // Check if user has permission to edit this board using permission service
    const hasPermission = await this.permissionService.hasPermission(
      id,
      userId,
      "editor"
    );
    if (!hasPermission) {
      throw new Error("Insufficient permissions to update this board");
    }

    return this.boardRepository.updateBoard(id, boardData);
  }

  async deleteBoard(id: string, userId: string): Promise<boolean> {
    // Check if user is the owner of this board using permission service
    const hasPermission = await this.permissionService.hasPermission(
      id,
      userId,
      "owner"
    );
    if (!hasPermission) {
      throw new Error("Only the board owner can delete this board");
    }

    return this.boardRepository.deleteBoard(id);
  }

  async boardExists(id: string): Promise<boolean> {
    return this.boardRepository.boardExists(id);
  }

  async userHasAccessToBoard(
    boardId: string,
    userId: string
  ): Promise<boolean> {
    return await this.permissionService.hasPermission(
      boardId,
      userId,
      "viewer"
    );
  }

  async getUserPermissionForBoard(
    boardId: string,
    userId: string
  ): Promise<BoardPermission | undefined> {
    return this.boardRepository.getUserPermissionForBoard(boardId, userId);
  }

  // Alias methods for TaskService compatibility
  async hasUserAccess(boardId: string, userId: string): Promise<boolean> {
    return this.userHasAccessToBoard(boardId, userId);
  }

  async getUserPermission(
    boardId: string,
    userId: string
  ): Promise<"owner" | "editor" | "viewer" | null> {
    // Use permission service instead of repository directly
    const hasOwner = await this.permissionService.hasPermission(
      boardId,
      userId,
      "owner"
    );
    if (hasOwner) return "owner";

    const hasEditor = await this.permissionService.hasPermission(
      boardId,
      userId,
      "editor"
    );
    if (hasEditor) return "editor";

    const hasViewer = await this.permissionService.hasPermission(
      boardId,
      userId,
      "viewer"
    );
    if (hasViewer) return "viewer";

    return null;
  }
}
