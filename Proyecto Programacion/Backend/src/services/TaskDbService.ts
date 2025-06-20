import { CreateTaskDTO } from "../DTOs/task/CreateTaskDTO";
import { TaskDTO } from "../DTOs/task/TaskDTO";
import { TaskQueryDTO } from "../DTOs/task/TaskQueryDTO";
import { UpdateTaskDTO } from "../DTOs/task/UpdateTaskDTO";
import { ITaskService } from "../Interfaces/ITaskService";
import { Paginated } from "../Interfaces/Paginated";


export class TaskDbService implements ITaskService{
    createTask(userId: number, boardId: number, data: CreateTaskDTO): Promise<TaskDTO> {
        throw new Error("Method not implemented.");
    }
    getTask(userId: number, boardId: number, query: TaskQueryDTO): Promise<Paginated<TaskDTO>> {
        throw new Error("Method not implemented.");
    }
    getTaskById(userId: number, taskId: number): Promise<TaskDTO> {
        throw new Error("Method not implemented.");
    }
    updateTask(userId: number, taskId: number, data: UpdateTaskDTO): Promise<TaskDTO> {
        throw new Error("Method not implemented.");
    }
    deleteTask(userId: number, taskId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }

}