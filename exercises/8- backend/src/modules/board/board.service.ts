import {
  Board,
  CreateBoardRequest,
  UpdateBoardRequest,
  BoardPermission,
  ShareBoardRequest,
} from "../../types";
import { BoardRepository } from "./board.repository";
import { UserRepository } from "../user/user.repository";

export class BoardService {
  constructor(
    private readonly boardRepository: BoardRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getAllBoardsByUser(userId: string): Promise<Board[]> {
    return this.boardRepository.getAllBoardsByUser(userId);
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
    // Check if user has permission to edit this board
    const permission = await this.boardRepository.getUserPermissionForBoard(
      id,
      userId
    );
    if (
      !permission ||
      (permission.permission_level !== "owner" &&
        permission.permission_level !== "editor")
    ) {
      throw new Error("Insufficient permissions to update this board");
    }

    return this.boardRepository.updateBoard(id, boardData);
  }

  async deleteBoard(id: string, userId: string): Promise<boolean> {
    // Check if user is the owner of this board
    const permission = await this.boardRepository.getUserPermissionForBoard(
      id,
      userId
    );
    if (!permission || permission.permission_level !== "owner") {
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
    const permission = await this.boardRepository.getUserPermissionForBoard(
      boardId,
      userId
    );
    return !!permission;
  }

  async getUserPermissionForBoard(
    boardId: string,
    userId: string
  ): Promise<BoardPermission | undefined> {
    return this.boardRepository.getUserPermissionForBoard(boardId, userId);
  }

  async shareBoard(
    boardId: string,
    shareData: ShareBoardRequest,
    requestingUserId: string
  ): Promise<BoardPermission> {
    // Check if requesting user is the owner of the board
    const permission = await this.boardRepository.getUserPermissionForBoard(
      boardId,
      requestingUserId
    );
    if (!permission || permission.permission_level !== "owner") {
      throw new Error("Only the board owner can share this board");
    }

    // Find the target user by email
    const targetUser = await this.userRepository.getUserByEmail(
      shareData.user_email
    );
    if (!targetUser) {
      throw new Error("User not found with the provided email");
    }

    // Don't allow sharing with the owner
    if (targetUser.id === requestingUserId) {
      throw new Error("Cannot share board with yourself");
    }

    return this.boardRepository.shareBoardWithUser(
      boardId,
      targetUser.id,
      shareData.permission_level
    );
  }

  async removeBoardAccess(
    boardId: string,
    targetUserId: string,
    requestingUserId: string
  ): Promise<boolean> {
    // Check if requesting user is the owner of the board
    const permission = await this.boardRepository.getUserPermissionForBoard(
      boardId,
      requestingUserId
    );
    if (!permission || permission.permission_level !== "owner") {
      throw new Error("Only the board owner can remove access to this board");
    }

    // Don't allow removing owner's access
    if (targetUserId === requestingUserId) {
      throw new Error("Cannot remove your own access as the owner");
    }

    return this.boardRepository.removeBoardPermission(boardId, targetUserId);
  }

  async getBoardPermissions(
    boardId: string,
    requestingUserId: string
  ): Promise<Array<BoardPermission & { username: string; email: string }>> {
    // Check if requesting user has access to the board
    const permission = await this.boardRepository.getUserPermissionForBoard(
      boardId,
      requestingUserId
    );
    if (!permission) {
      throw new Error("Access denied to this board");
    }

    return this.boardRepository.getBoardPermissions(boardId);
  }

  // Alias methods for TaskService compatibility
  async hasUserAccess(boardId: string, userId: string): Promise<boolean> {
    return this.userHasAccessToBoard(boardId, userId);
  }

  async getUserPermission(
    boardId: string,
    userId: string
  ): Promise<"owner" | "editor" | "viewer" | null> {
    const permission = await this.boardRepository.getUserPermissionForBoard(
      boardId,
      userId
    );
    return permission ? permission.permission_level : null;
  }
}
