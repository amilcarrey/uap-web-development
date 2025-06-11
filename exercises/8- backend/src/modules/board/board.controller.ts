import { Request, Response } from "express";
import { BoardService } from "./board.service";
import {
  CreateBoardRequest,
  UpdateBoardRequest,
  ShareBoardRequest,
} from "../../types";

export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  getAllBoards = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const boards = await this.boardService.getAllBoardsByUser(req.user.id);
      res.json({
        success: true,
        data: boards,
      });
    } catch (error) {
      console.error("Error getting boards:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve boards",
      });
    }
  };

  getBoardById = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const board = await this.boardService.getBoardById(
        id as string,
        req.user.id
      );

      if (!board) {
        res.status(404).json({
          success: false,
          error: "Board not found or access denied",
        });
        return;
      }

      res.json({
        success: true,
        data: board,
      });
    } catch (error) {
      console.error("Error getting board:", error);
      res.status(500).json({
        success: false,
        error: "Failed to retrieve board",
      });
    }
  };

  createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const boardData: CreateBoardRequest = req.body;
      const board = await this.boardService.createBoard(boardData, req.user.id);

      res.status(201).json({
        success: true,
        data: board,
        message: "Board created successfully",
      });
    } catch (error) {
      console.error("Error creating board:", error);
      res.status(500).json({
        success: false,
        error: "Failed to create board",
      });
    }
  };

  updateBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const boardData: UpdateBoardRequest = req.body;

      const board = await this.boardService.updateBoard(
        id as string,
        boardData,
        req.user.id
      );

      if (!board) {
        res.status(404).json({
          success: false,
          error: "Board not found",
        });
        return;
      }

      res.json({
        success: true,
        data: board,
        message: "Board updated successfully",
      });
    } catch (error) {
      console.error("Error updating board:", error);

      if (
        error instanceof Error &&
        error.message === "Insufficient permissions to update this board"
      ) {
        res.status(403).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to update board",
      });
    }
  };

  deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      await this.boardService.deleteBoard(id as string, req.user.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting board:", error);

      if (
        error instanceof Error &&
        error.message === "Only the board owner can delete this board"
      ) {
        res.status(403).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to delete board",
      });
    }
  };

  shareBoard = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const shareData: ShareBoardRequest = req.body;

      const permission = await this.boardService.shareBoard(
        id as string,
        shareData,
        req.user.id
      );

      res.status(201).json({
        success: true,
        data: permission,
        message: "Board shared successfully",
      });
    } catch (error) {
      console.error("Error sharing board:", error);

      if (error instanceof Error) {
        if (error.message === "Only the board owner can share this board") {
          res.status(403).json({
            success: false,
            error: error.message,
          });
          return;
        }

        if (error.message === "User not found with the provided email") {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }

        if (error.message === "Cannot share board with yourself") {
          res.status(400).json({
            success: false,
            error: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: "Failed to share board",
      });
    }
  };

  removeBoardAccess = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }
      const { id, userId } = req.params;
      if (!id || !userId) {
        res.status(400).json({
          success: false,
          error: "Board ID and User ID are required",
        });
        return;
      }

      await this.boardService.removeBoardAccess(
        id as string,
        userId as string,
        req.user.id
      );
      res.status(204).send();
    } catch (error) {
      console.error("Error removing board access:", error);

      if (error instanceof Error) {
        if (
          error.message ===
            "Only the board owner can remove access to this board" ||
          error.message === "Cannot remove your own access as the owner"
        ) {
          res.status(403).json({
            success: false,
            error: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        error: "Failed to remove board access",
      });
    }
  };

  getBoardPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: "User not authenticated",
        });
        return;
      }

      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const permissions = await this.boardService.getBoardPermissions(
        id as string,
        req.user.id
      );

      res.json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      console.error("Error getting board permissions:", error);

      if (
        error instanceof Error &&
        error.message === "Access denied to this board"
      ) {
        res.status(403).json({
          success: false,
          error: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: "Failed to retrieve board permissions",
      });
    }
  };
}
