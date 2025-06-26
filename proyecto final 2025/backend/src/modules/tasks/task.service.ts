import { TaskRepository } from "./task.repository";
import { Task } from "../../types";

export const TaskService = {
  async getPaginated(
    filter: string, 
    page: number, 
    limit: number, 
    boardId?: string
  ): Promise<{ tasks: Task[]; totalPages: number }> {
    return await TaskRepository.getPaginated(filter, page, limit, boardId);
  },

  async create(text: string, boardId: string): Promise<Task> {
    return await TaskRepository.create(text, boardId.toString());
  },

  async update(
    id: string, 
    updates: Partial<{ text: string; completed: boolean; board_id: string }>
  ): Promise<Task | null> {
    return await TaskRepository.update(id.toString(), updates);
  },

  async delete(id: string): Promise<void> {
    return await TaskRepository.delete(id);
  },

   async clearCompleted(boardId: string): Promise<void> {
    return await TaskRepository.clearCompleted(boardId);
  },
};
