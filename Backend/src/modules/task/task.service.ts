import { Task, CreateTaskRequest } from "../../types";
import { TaskRepository } from "./task.repository";

export class TaskService {
    constructor(private readonly taskRepository: TaskRepository) { }

    async getAllTasks(boardId: string, limit: number, offset: number, filter: string): Promise<Task[]> {
        return this.taskRepository.getAllTasks(boardId, limit, offset, filter);
    }
    async getTaskById(id: string): Promise<Task | undefined> {
        return this.taskRepository.getTaskById(id);
    }
    async createTask(taskData: CreateTaskRequest): Promise<Task> {
        return this.taskRepository.createTask(taskData);
    }
    async completeTask(id: string): Promise<boolean> {
        return this.taskRepository.completeTask(id);
    }
    async deleteTask(id: string): Promise<boolean> {
        return this.taskRepository.deleteTask(id);
    }
    async updateTask(id: string, name: string): Promise<void> {
        return this.taskRepository.updateTask(id, name);
    }
    async clearCompleted(boardId: string): Promise<void> {
        return this.taskRepository.clearCompletedTasks(boardId);
    }
    async countTask(boardId: string, filter: string): Promise<number> {
        return this.taskRepository.countTasks(boardId, filter);
    }

    async getUserBoardRole(userId: string, boardId: string): Promise<string | null> {
        return this.taskRepository.getUserBoardRole(userId, boardId);
    }

    async getTaskBoardId(taskId: string): Promise<string | null> {
        return this.taskRepository.getTaskBoardId(taskId);
    }

    async searchTasks(boardId: string, query: string, limit: number, offset: number): Promise<Task[]> {
        return this.taskRepository.searchTasks(boardId, query, limit, offset);
    }

}