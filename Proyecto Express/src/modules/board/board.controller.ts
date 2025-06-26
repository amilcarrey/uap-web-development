import { Request, Response } from "express";
import { BoardService } from "./board.service";
import { CreateBoardRequest } from "../../types";

export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  getAllBoards = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;

      const boards = await this.boardService.getAllBoards(userId);
      res.json(boards);
    } catch (error) {
      console.error("Error getting boards:", error);
      res.status(500).json({ error: "Failed to retrieve boards" });
    }
  };

  getBoardById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const board = await this.boardService.getBoardById(id);

      if (!board) {
        res.status(404).json({ error: "Board not found" });
        return;
      }

      res.json({ board });
    } catch (error) {
      console.error("Error getting board:", error);
      res.status(500).json({ error: "Failed to retrieve board" });
    }
  };

  createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const boardData: CreateBoardRequest = req.body;

      if (!boardData.name) {
        res.status(400).json({ error: "Board name is required" });
        return;
      }

      const board = await this.boardService.createBoard(boardData, userId);
      res.status(201).json({ board });
    } catch (error) {
      console.error("Error creating board:", error);
      res.status(500).json({ error: "Failed to create board" });
    }
  };

  deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const exists = await this.boardService.boardExists(id);

      if (!exists) {
        res.status(404).json({ error: "Board not found" });
        return;
      }

      await this.boardService.deleteBoard(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting board:", error);
      res.status(500).json({ error: "Failed to delete board" });
    }
  };

  getBoardRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const boardId = req.params.id;

      const role = await this.boardService.getBoardRole(userId, boardId);
      if (!role) {
        res.status(404).json({ error: "Role not found for this board" });
        return;
      }

      res.json({ role: role.role });
    } catch (error) {
      console.error("Error getting board role:", error);
      res.status(500).json({ error: "Failed to retrieve board role" });
    }
  };

  shareBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, targetUserId, role } = req.body;
      const requesterId = req.user.id;
      console.log("Sharing board:", { boardId, targetUserId, role, requesterId });

      const isOwner = await this.boardService.isOwner(requesterId, boardId);
      if (!isOwner) {
        res.status(403).json({ error: "Only the owner can share boards" });
        return;
      }

      await this.boardService.addUserToBoard(targetUserId, boardId, role);
      res.status(200).json({ message: "Board shared successfully" });
    } catch (error) {
      console.error("Error sharing board:", error);
      res.status(500).json({ error: "Failed to share board" });
    }
  }

  removeUserFromBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      const { boardId, targetUserId } = req.body;
      const requesterId = req.user.id;

      const isOwner = await this.boardService.isOwner(requesterId, boardId);
      if (!isOwner) {
        res.status(403).json({ error: "Only the owner can remove users" });
        return;
      }

      await this.boardService.removeUserFromBoard(targetUserId, boardId);
      res.status(200).json({ message: "User removed from board" });
    } catch (error) {
      console.error("Error removing user from board:", error);
      res.status(500).json({ error: "Failed to remove user" });
    }
  };
}