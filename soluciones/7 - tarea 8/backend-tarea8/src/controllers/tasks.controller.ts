import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Task } from "../entities/Task";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = Number(req.query.boardId);
    if (!boardId) {
      res.status(400).json({ message: "Board ID required" });
      return;
    }

    const page = Number(req.query.page) || 1;
    const search = (req.query.search as string) || "";
    const completedParam = req.query.completed;
    let completed: boolean | undefined = undefined;
    if (completedParam === "true") completed = true;
    else if (completedParam === "false") completed = false;

    const taskRepo = AppDataSource.getRepository(Task);

    const query = taskRepo.createQueryBuilder("task")
      .where("task.boardId = :boardId", { boardId });

    if (search) {
      query.andWhere("task.content LIKE :search", { search: `%${search}%` });
    }
    if (completed !== undefined) {
      query.andWhere("task.completed = :completed", { completed });
    }

    const pageSize = 10;

    const [tasks, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const totalPages = Math.ceil(total / pageSize);

    res.json({ tasks, totalPages });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { boardId, content } = req.body;
    if (!boardId || !content) {
      res.status(400).json({ message: "Board ID and content are required" });
      return;
    }

    const taskRepo = AppDataSource.getRepository(Task);

    const task = new Task();
    task.boardId = boardId;
    task.content = content;
    task.completed = false;

    await taskRepo.save(task);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = Number(req.params.taskId);
    if (!taskId) {
      res.status(400).json({ message: "Task ID required" });
      return;
    }

    const { content, completed } = req.body;

    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOneBy({ id: taskId });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    if (content !== undefined) task.content = content;
    if (completed !== undefined) task.completed = completed;

    await taskRepo.save(task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = Number(req.params.taskId);
    if (!taskId) {
      res.status(400).json({ message: "Task ID required" });
      return;
    }

    const taskRepo = AppDataSource.getRepository(Task);

    const task = await taskRepo.findOneBy({ id: taskId });
    if (!task) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    await taskRepo.remove(task);

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const deleteCompletedTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const boardId = Number(req.query.boardId);
    console.log("Delete completed tasks for boardId:", boardId);

    if (!boardId) {
      res.status(400).json({ message: "Board ID required" });
      return;
    }

    const taskRepo = AppDataSource.getRepository(Task);

    await taskRepo.createQueryBuilder()
      .delete()
      .where("boardId = :boardId", { boardId })
      .andWhere("completed = true")
      .execute();

    res.json({ message: "Completed tasks deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};
