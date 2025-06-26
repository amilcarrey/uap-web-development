import { Request, Response } from "express";
import { TaskService } from "./task.service";
import { CreateTaskRequest } from "../../types";
import { error } from "console";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.taskService.getAllTasks();
      res.json({ tasks });
    } catch (error) {
      console.error("Error getting tasks:", error);
      res.status(500).json({ error: "Failed to retrieve tasks" });
    }
  };

  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const task = await this.taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      res.json({ task });
    } catch (error) {
      console.error("Error getting task:", error);
      res.status(500).json({ error: "Failed to retrieve task" });
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const taskData: CreateTaskRequest = req.body;

      if (!taskData.text) {
        res.status(400).json({ error: "Task name is required" });
        return;
      }

      const task = await this.taskService.createTask(userId, taskData);
      res.status(201).json({ task });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const exists = await this.taskService.taskExists(id);

      if (!exists) {
        res.status(404).json({ error: "Task not found" });
        return;
      }

      await this.taskService.deleteTask(userId, id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: "Failed to delete task" });
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { text } = req.body;

      if (!text) {
        res.status(400).json({ error: "New text is required" });
        return;
      }

      const task = await this.taskService.updateTask(userId, id, text);
      res.json({ task });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task "});
    }
  };

  toggleTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const task = await this.taskService.toggleTask(userId, id);
      res.json({ task });
    } catch (error) {
      console.error("Error toggling task:", error);
      res.status(500).json({ error: "Failed to toggle task" })
    }
  };

  clearCompleted = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      const activeBoardId = req.query.activeBoardId as string;

      if (!activeBoardId) {
        res.status(400).json({ error: "Board ID is required" });
        return;
      }

      await this.taskService.clearCompleted(userId, activeBoardId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing completed tasks:", error);
      res.status(500).json({ error: "Failed to clear completed tasks" });
    }
  }; 
}