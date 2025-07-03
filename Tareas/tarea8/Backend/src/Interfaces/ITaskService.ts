import { CreateTaskDTO } from "../DTOs/task/CreateTaskSchema";
import { TaskDTO } from "../DTOs/task/TaskSchema";
import { UpdateTaskDTO } from "../DTOs/task/UpdateTaskSchema";
import { TaskQueryDTO } from "../DTOs/task/TaskQuerySchema";
import { Paginated } from "./Paginated";


export interface ITaskService{
    createTask(userId: number, boardId: number, data: CreateTaskDTO): Promise<TaskDTO>;
    getTask(userId: number, boardId: number, query: TaskQueryDTO): Promise<Paginated<TaskDTO>>;
    //getTaskById(userId: number, taskId: number): Promise<TaskDTO>;
    updateTask(taskId: number, data: UpdateTaskDTO, userId: number): Promise<TaskDTO>;
    deleteTask(taskId: number, userId: number): Promise<void>;
    deleteCompletedTasks(userId: number, boardId: number): Promise<number>;
}

