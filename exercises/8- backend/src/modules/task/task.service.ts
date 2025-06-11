import { TaskRepository } from "./task.repository";
import { BoardService } from "../board/board.service";
import { BoardRepository } from "../board/board.repository";
import { UserRepository } from "../user/user.repository";
import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  PaginationParams,
  ApiResponse,
  PaginationResponse,
} from "../../types";
import { PaginationUtils } from "../../utils";

export class TaskService {
  private taskRepository: TaskRepository;
  private boardService: BoardService;

  constructor() {
    this.taskRepository = new TaskRepository();
    const boardRepository = new BoardRepository();
    const userRepository = new UserRepository();
    this.boardService = new BoardService(boardRepository, userRepository);
  }

  async getTasksByBoard(
    boardId: string,
    userId: string,
    paginationParams: PaginationParams
  ): Promise<ApiResponse<PaginationResponse<Task[]>>> {
    try {
      // Check if user has access to the board
      const hasAccess = await this.boardService.hasUserAccess(boardId, userId);
      if (!hasAccess) {
        return {
          success: false,
          message: "Access denied to this board",
          statusCode: 403,
        };
      }

      const { tasks, totalCount } = await this.taskRepository.getTasksByBoard(
        boardId,
        paginationParams
      );
      const pagination = PaginationUtils.calculatePagination(
        paginationParams.page,
        paginationParams.limit,
        totalCount
      );

      return {
        success: true,
        data: {
          items: tasks,
          pagination,
          totalCount,
        },
        message: "Tasks retrieved successfully",
      };
    } catch (error) {
      console.error("TaskService.getTasksByBoard error:", error);
      return {
        success: false,
        message: "Failed to retrieve tasks",
        statusCode: 500,
      };
    }
  }

  async getTaskById(id: string, userId: string): Promise<ApiResponse<Task>> {
    try {
      const task = await this.taskRepository.getTaskById(id);
      if (!task) {
        return {
          success: false,
          message: "Task not found",
          statusCode: 404,
        };
      }

      // Check if user has access to the board
      const hasAccess = await this.boardService.hasUserAccess(
        task.board_id,
        userId
      );
      if (!hasAccess) {
        return {
          success: false,
          message: "Access denied to this task",
          statusCode: 403,
        };
      }

      return {
        success: true,
        data: task,
        message: "Task retrieved successfully",
      };
    } catch (error) {
      console.error("TaskService.getTaskById error:", error);
      return {
        success: false,
        message: "Failed to retrieve task",
        statusCode: 500,
      };
    }
  }

  async createTask(
    taskData: CreateTaskRequest,
    userId: string
  ): Promise<ApiResponse<Task>> {
    try {
      // Check if user has editor or owner access to the board
      const permission = await this.boardService.getUserPermission(
        taskData.board_id,
        userId
      );
      if (!permission || permission === "viewer") {
        return {
          success: false,
          message: "Insufficient permissions to create tasks",
          statusCode: 403,
        };
      }

      const task = await this.taskRepository.createTask(taskData);

      return {
        success: true,
        data: task,
        message: "Task created successfully",
        statusCode: 201,
      };
    } catch (error) {
      console.error("TaskService.createTask error:", error);
      return {
        success: false,
        message: "Failed to create task",
        statusCode: 500,
      };
    }
  }

  async updateTask(
    id: string,
    taskData: UpdateTaskRequest,
    userId: string
  ): Promise<ApiResponse<Task>> {
    try {
      // Get task to check board access
      const boardId = await this.taskRepository.getBoardIdByTaskId(id);
      if (!boardId) {
        return {
          success: false,
          message: "Task not found",
          statusCode: 404,
        };
      }

      // Check if user has editor or owner access to the board
      const permission = await this.boardService.getUserPermission(
        boardId,
        userId
      );
      if (!permission || permission === "viewer") {
        return {
          success: false,
          message: "Insufficient permissions to update tasks",
          statusCode: 403,
        };
      }

      const task = await this.taskRepository.updateTask(id, taskData);
      if (!task) {
        return {
          success: false,
          message: "Task not found",
          statusCode: 404,
        };
      }

      return {
        success: true,
        data: task,
        message: "Task updated successfully",
      };
    } catch (error) {
      console.error("TaskService.updateTask error:", error);
      return {
        success: false,
        message: "Failed to update task",
        statusCode: 500,
      };
    }
  }

  async deleteTask(id: string, userId: string): Promise<ApiResponse<void>> {
    try {
      // Get task to check board access
      const boardId = await this.taskRepository.getBoardIdByTaskId(id);
      if (!boardId) {
        return {
          success: false,
          message: "Task not found",
          statusCode: 404,
        };
      }

      // Check if user has editor or owner access to the board
      const permission = await this.boardService.getUserPermission(
        boardId,
        userId
      );
      if (!permission || permission === "viewer") {
        return {
          success: false,
          message: "Insufficient permissions to delete tasks",
          statusCode: 403,
        };
      }

      await this.taskRepository.deleteTask(id);

      return {
        success: true,
        message: "Task deleted successfully",
      };
    } catch (error) {
      console.error("TaskService.deleteTask error:", error);
      return {
        success: false,
        message: "Failed to delete task",
        statusCode: 500,
      };
    }
  }

  async clearCompletedTasks(
    boardId: string,
    userId: string
  ): Promise<ApiResponse<{ deletedCount: number }>> {
    try {
      // Check if user has editor or owner access to the board
      const permission = await this.boardService.getUserPermission(
        boardId,
        userId
      );
      if (!permission || permission === "viewer") {
        return {
          success: false,
          message: "Insufficient permissions to clear completed tasks",
          statusCode: 403,
        };
      }

      const deletedCount = await this.taskRepository.clearCompletedTasks(
        boardId
      );

      return {
        success: true,
        data: { deletedCount },
        message: `${deletedCount} completed tasks cleared successfully`,
      };
    } catch (error) {
      console.error("TaskService.clearCompletedTasks error:", error);
      return {
        success: false,
        message: "Failed to clear completed tasks",
        statusCode: 500,
      };
    }
  }

  async getTaskCounts(
    boardId: string,
    userId: string
  ): Promise<
    ApiResponse<{ total: number; completed: number; active: number }>
  > {
    try {
      // Check if user has access to the board
      const hasAccess = await this.boardService.hasUserAccess(boardId, userId);
      if (!hasAccess) {
        return {
          success: false,
          message: "Access denied to this board",
          statusCode: 403,
        };
      }

      const counts = await this.taskRepository.getTaskCountsByBoard(boardId);

      return {
        success: true,
        data: counts,
        message: "Task counts retrieved successfully",
      };
    } catch (error) {
      console.error("TaskService.getTaskCounts error:", error);
      return {
        success: false,
        message: "Failed to retrieve task counts",
        statusCode: 500,
      };
    }
  }
}
