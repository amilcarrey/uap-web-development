import { Task, CreateTaskRequest } from "../../types";
import { TaskRepository } from "./task.repository";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    return this.taskRepository.getTaskById(id);
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    return this.taskRepository.createTask(taskData);
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.taskRepository.deleteTask(id);
  }

  async updateTask(id: string, newText: string): Promise<Task> {
    return this.taskRepository.updateTask(id, newText);
  }

  async toggleTask(id: string): Promise<Task> {
    return this.taskRepository.toggleTask(id);
  }

  async clearCompleted(activeBoardId: string): Promise<void> {
    await this.taskRepository.clearCompleted(activeBoardId);
  }

  async taskExists(id: string): Promise<boolean> {
    return this.taskRepository.taskExists(id);
  }
}