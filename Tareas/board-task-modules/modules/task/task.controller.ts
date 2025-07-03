import { Request, Response } from "express";
import { TaskService } from "./task.service";

export class TaskController {
  private service = new TaskService();

  getTasks = async (req: Request, res: Response) => {
    try {
      const boardId = parseInt(req.params.boardId);
      const tasks = await this.service.getTasks(boardId);
      res.json({ tasks });
    } catch (error) {
      res.status(500).json({ error: "Failed to get tasks" });
    }
  };

  createTask = async (req: Request, res: Response) => {
    try {
      const dto = {
        content: req.body.content,
        boardId: parseInt(req.params.boardId),
      };
      const task = await this.service.createTask(dto);
      res.status(201).json({ task });
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  };

  deleteTask = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await this.service.deleteTask(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  };

  toggleTask = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { completed } = req.body;
      await this.service.toggleTask(id, completed);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to toggle task" });
    }
  };
}
