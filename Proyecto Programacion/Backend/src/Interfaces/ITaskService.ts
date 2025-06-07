import { CreateTaskDTO } from "../DTOs/task/CreateTaskDTO";
import { TaskDTO } from "../DTOs/task/TaskDTO";
import { UpdateTaskDTO } from "../DTOs/task/UpdateTaskDTO";
import { TaskQueryDTO } from "../DTOs/task/TaskQueryDTO";
import { Paginated } from "./Paginated";


export interface ITaskService{
    createTask(userId: number, boardId: number, data: CreateTaskDTO): Promise<TaskDTO>;
    getTask(userId: number, boardId: number, query: TaskQueryDTO): Promise<Paginated<TaskDTO>>;
    getTaskById(userId: number, taskId: number): Promise<TaskDTO>;
    updateTask(userId: number, taskId: number, data: UpdateTaskDTO): Promise<TaskDTO>;
    deleteTask(userId: number, taskId: number): Promise<void>;
}


/*
createTask(userId: string, boardId: string, data: CreateTaskDto): Promise<TaskDto>
getTasks(userId: string, boardId: string, query: TaskQueryDto): Promise<Paginated<TaskDto>>
getTaskById(userId: string, taskId: string): Promise<TaskDto>
updateTask(userId: string, taskId: string, data: UpdateTaskDto): Promise<TaskDto>
deleteTask(userId: string, taskId: string): Promise<void>
*/