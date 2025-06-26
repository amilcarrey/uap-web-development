import { Task, CreateTaskRequest } from "../../types";
import { TaskRepository } from "./task.repository";
import { BoardRepository } from "../board/board.repository";

export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly boardRepository: BoardRepository
  ) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  async createTask(userId: string, taskData: CreateTaskRequest): Promise<Task> {
    const role = await this.boardRepository.getBoardRole(userId, taskData.activeBoardId);
    if (!role || role.role !== "viwer") {
      throw new Error("You do not have permission to create tasks in this board.");
    }
    return this.taskRepository.createTask(taskData);
  }

  async deleteTask(userId: string, id: string): Promise<boolean> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) throw new Error("Task not found");

    const role = await this.boardRepository.getBoardRole(userId, task.activeBoardId);
    if (!role || (role.role !== "owner" && role.role !== "editor")) {
      throw new Error("You do not have permission to delete this task.");
    }

    return this.taskRepository.deleteTask(id);
  }

  async updateTask(userId: string, id: string, newText: string): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) throw new Error("Task not found");

    const role = await this.boardRepository.getBoardRole(userId, task.activeBoardId);
    if (!role || (role.role !== "owner" && role.role !== "editor")) {
      throw new Error("You do not have permission to update this task.");
    }
    return this.taskRepository.updateTask(id, newText);
  }

  async toggleTask(userId: string, id: string): Promise<Task> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) throw new Error("Task not found");

    const role = await this.boardRepository.getBoardRole(userId, task.activeBoardId);
    if (!role || (role.role !== "owner" && role.role !== "editor")) {
      throw new Error("You do not have permission to toggle this task.");
    }
    return this.taskRepository.toggleTask(id);
  }

  async clearCompleted(userId: string, activeBoardId: string): Promise<void> {
    const role = await this.boardRepository.getBoardRole(userId, activeBoardId);
    if (!role || (role.role !== "owner" && role.role !== "editor")) {
      throw new Error("You do not have permission to delete these tasks.");
    }
    await this.taskRepository.clearCompleted(activeBoardId);
  }

  async taskExists(id: string): Promise<boolean> {
    return this.taskRepository.taskExists(id);
  }
}