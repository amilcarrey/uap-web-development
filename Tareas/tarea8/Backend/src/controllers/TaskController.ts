import {Request, Response} from 'express';
import {TaskDbService} from '../services/TaskDbService';
import { TaskDTO } from '../DTOs/task/TaskSchema';
import { CreateTaskDTO, CreateTaskSchema } from '../DTOs/task/CreateTaskSchema';
import { TaskQuerySchema } from '../DTOs/task/TaskQuerySchema';
import { UpdateTaskDTO, UpdateTaskSchema } from '../DTOs/task/UpdateTaskSchema';
 
const taskService = new TaskDbService();

export class TaskController {

    
    static async createTask(req: Request, res: Response) {
        const parseResult = CreateTaskSchema.safeParse(req.body);
        if (!parseResult.success) {
            const error = new Error("Datos inválidos");
            (error as any).status = 400;
            (error as any).details = parseResult.error.errors;
            throw error;
        }

        const data: CreateTaskDTO = parseResult.data;
        const currentUserId = (req as any).user?.id;
        const boardId = Number(req.params.boardId); 

        console.log(`currentUserId: ${currentUserId}, boardId: ${boardId}`);
        console.log(`req.params: ${JSON.stringify(req.params)}`);
        console.log(`req.url: ${req.url}`);
        console.log(`req.originalUrl: ${req.originalUrl}`);

        if (!currentUserId || isNaN(boardId)) {
            const error = new Error("ID de usuario o tablero inválido");
            (error as any).status = 400;
            throw error;
        }

        const task = await taskService.createTask(currentUserId, boardId, data);
        res.status(201).json(task);
        }

    
    static async getTaks(req: Request, res: Response){
        
        const query = {
            ...req.query,
            page: req.query.page ? Number(req.query.page) : undefined,
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            active: req.query.active !== undefined ? req.query.active === "true" : undefined,
        };

        
        const boardId = Number(req.params.boardId);

        const parseResult = TaskQuerySchema.safeParse(query);
        if(!parseResult.success){
            const error = new Error("Datos inválidos");
            (error as any).status = 400;
            (error as any).details = parseResult.error.errors;
            throw error;
        }

        const parsedQuery = parseResult.data;
        const currentUserId = (req as any).user?.id;

        if (!currentUserId || isNaN(boardId)) {
            
            const error = new Error("ID de usuario o tablero inválido");
            (error as any).status = 400;
            throw error;
        }

        const tasks = await taskService.getTask(currentUserId, boardId, parsedQuery);
        res.json(tasks);
    }

    
    static async updateTask(req: Request, res: Response){
        const parseResult = UpdateTaskSchema.safeParse(req.body);
        if(!parseResult.success){
            const error = new Error("Datos inválidos");
            (error as any).status = 400;
            (error as any).details = parseResult.error.errors;
            throw error;
        }
        const data: UpdateTaskDTO = parseResult.data;
        const taskId = Number(req.params.taskId);
        const currentUserId = (req as any).user?.id;

        if (!currentUserId || isNaN(taskId)) {
            const error = new Error("ID de usuario o tarea inválido");
            (error as any).status = 400;
            throw error;
        }

        const update = await taskService.updateTask(taskId, data, currentUserId);
        res.json(update);
    }

    
    static async deleteTask(req: Request, res: Response){
        const taskId = Number(req.params.taskId);
        const currentUserId = (req as any).user?.id;

        if (!currentUserId || isNaN(taskId)) {
            const error = new Error("ID de usuario o tarea inválido");
            (error as any).status = 400;
            throw error;
        }
        await taskService.deleteTask(taskId, currentUserId);
        res.status(204).send();
    }

    
    static async deleteCompletedTasks(req: Request, res: Response) {
        const currentUserId = (req as any).user?.id;
        const boardId = Number(req.params.boardId);

        if (!currentUserId || isNaN(boardId)) {
            const error = new Error("ID de usuario o tablero inválido");
            (error as any).status = 400;
            throw error;
        }

        const deletedCount = await taskService.deleteCompletedTasks(currentUserId, boardId);
        res.json({ deleted: deletedCount });
    }


    
    
}
