import { TaskRepository } from "./task.repository";
import { CreateTaskDto, TaskResponseDto } from "./task.dto";

export class TaskService {
  private taskRepo = new TaskRepository();

  async getTasks(boardId: number): Promise<TaskResponseDto[]> {
    const tasks = await this.taskRepo.findAllByBoard(boardId);
    return tasks.map(t => ({
      id: t.id,
      content: t.content,
      completed: t.completed,
      boardId: t.boardId
    }));
  }

  async createTask(dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.taskRepo.create(dto);
    return {
      id: task.id,
      content: task.content,
      completed: task.completed,
      boardId: task.boardId,
    };
  }

  async deleteTask(id: number): Promise<void> {
    await this.taskRepo.delete(id);
  }

  async toggleTask(id: number, completed: boolean): Promise<void> {
    await this.taskRepo.toggleComplete(id, completed);
  }
}
