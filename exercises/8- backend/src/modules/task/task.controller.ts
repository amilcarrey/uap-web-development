import { Request, Response } from "express";
import { TaskService } from "./task.service";
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  PaginationParams,
} from "../../types";

export class TaskController {
  private taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  async getTasks(req: Request, res: Response): Promise<void> {
    try {
      const { boardId } = req.params;
      const userId = req.user!.id;

      if (!boardId) {
        res.status(400).json({
          success: false,
          message: "Board ID is required",
        });
        return;
      }

      // Parse pagination and filter parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const search = req.query.search as string;

      // Map status to filter for compatibility
      let filter: "all" | "active" | "completed" = "all";
      if (status === "pending") {
        filter = "active";
      } else if (status === "completed") {
        filter = "completed";
      }

      const paginationParams: PaginationParams = {
        page,
        limit,
        filter,
        search,
      };

      const result = await this.taskService.getTasksByBoard(
        boardId,
        userId,
        paginationParams
      );

      res.status(result.statusCode || 200).json(result);
    } catch (error) {
      console.error("TaskController.getTasks error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      if (!id) {
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      const result = await this.taskService.getTaskById(id, userId);

      res.status(result.statusCode || 200).json(result);
    } catch (error) {
      console.error("TaskController.getTask error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { boardId } = req.params;
      if (!boardId) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const userId = req.user!.id;
      const { text } = req.body;

      const taskData: CreateTaskRequest = {
        board_id: boardId as string,
        text: text.trim(),
      };

      const result = await this.taskService.createTask(taskData, userId);

      res.status(result.statusCode || 200).json(result);
    } catch (error) {
      console.error("TaskController.createTask error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Task ID is required",
        });
        return;
      }

      const userId = req.user!.id;
      const { text, completed } = req.body;

      const taskData: UpdateTaskRequest = {};

      if (text !== undefined) {
        taskData.text = text.trim();
      }

      if (completed !== undefined) {
        taskData.completed = completed;
      }

      const result = await this.taskService.updateTask(
        id as string,
        taskData,
        userId
      );

      res.status(result.statusCode || 200).json(result);
    } catch (error) {
      console.error("TaskController.updateTask error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({
          success: false,
          error: "Task ID is required",
        });
        return;
      }

      const userId = req.user!.id;

      const result = await this.taskService.deleteTask(id as string, userId);

      res.status(result.statusCode || 200).json(result);
    } catch (error) {
      console.error("TaskController.deleteTask error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async clearCompleted(req: Request, res: Response): Promise<void> {
    try {
      const { boardId } = req.params;
      if (!boardId) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const userId = req.user!.id;

      const result = await this.taskService.clearCompletedTasks(
        boardId as string,
        userId
      );

      res.status(result.statusCode || 200).json(result);
    } catch (error) {
      console.error("TaskController.clearCompleted error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }

  async getTaskCounts(req: Request, res: Response): Promise<void> {
    try {
      const { boardId } = req.params;
      if (!boardId) {
        res.status(400).json({
          success: false,
          error: "Board ID is required",
        });
        return;
      }

      const userId = req.user!.id;

      const result = await this.taskService.getTaskCounts(
        boardId as string,
        userId
      );

      res.status(result.statusCode || 200).json(result);
    } catch (error) {
      console.error("TaskController.getTaskCounts error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
}
