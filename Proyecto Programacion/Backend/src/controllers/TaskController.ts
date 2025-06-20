import {Request, Response} from 'express';
import {TaskDbService} from '../services/TaskDbService';
import { TaskDTO } from '../DTOs/task/TaskSchema';
import { CreateTaskDTO, CreateTaskSchema } from '../DTOs/task/CreateTaskSchema';
import { TaskQuerySchema } from '../DTOs/task/TaskQuerySchema';
import { UpdateTaskDTO } from '../DTOs/task/UpdateTaskSchema';
 
const taskService = new TaskDbService();

export class TaskController {

    //Crear Tarea
    static async createTask(req: Request, res: Response) {
        try{
            //Validar con zod
            const parseResult = CreateTaskSchema.safeParse(req.body);
            if(!parseResult.success){
                res.status(400).json({ error: "Datos inválidos", details: parseResult.error.errors });
                return;
            }  

            const data: CreateTaskDTO = parseResult.data;
            const userId = Number(req.params.userId);
            const boardId = Number(req.params.boardId);

            const task = await taskService.createTask(userId, boardId, data);
            res.status(201).json(task);
            
        }catch(error){
            res.status(500).json({error: 'Error al crear la tarea', details: error instanceof Error ? error.message : String(error)});
        }
    }

    //Obtener tareas de un tablero (paginadas)
    static async getTaks(req: Request, res: Response){
        try{
            const parseResult = TaskQuerySchema.safeParse(req.query);
            if(!parseResult.success){
                res.status(400).json({ error: "Datos inválidos", details: parseResult.error.errors });
                return;
            }

            const query = parseResult.data;
            const userId = Number(req.params.userId);
            const boardId = Number(req.params.boardId);

            const tasks = await taskService.getTask(userId, boardId, query);
            res.json(tasks);

        }catch(error){
            res.status(500).json({ error: 'Error al obtener las tareas', details: error instanceof Error ? error.message : String(error) });
        }
    }

    //Obtener una tarea por su ID (Solamente para realizar pruebas)
    static async getTaskById(req: Request, res: Response){
        try{
            const taskId = Number(req.params.taskId);

            const task = await taskService.getTaskById(taskId);
            res.json(task);
        }catch(error){
            res.status(500).json({ error: 'Error al obtener la tarea', details: error instanceof Error ? error.message : String(error) });
        }
    }

    //Actualizar una tarea
    static async updateTask(req: Request, res: Response){
        try{
            //Valido lso datros de entrada con Zod
            const parseResult = CreateTaskSchema.safeParse(req.body);
            if(!parseResult.success){
                res.status(400).json({ error: "Datos inválidos", details: parseResult.error.errors });
                return;
            }
            const data: UpdateTaskDTO = parseResult.data;
            const taskId = Number(req.params.taskId);

            const update = await taskService.updateTask(taskId, data);
            res.json(update);
        }catch(error){
            res.status(500).json({ error: 'Error al actualizar la tarea', details: error instanceof Error ? error.message : String(error) });
        }
    }

    //Eliminar una tarea
    static async deleteTask(req: Request, res: Response){
        try{
            const taskId = Number(req.params.taskId);
            await taskService.deleteTask(taskId);
            
            res.status(204).send();
        }catch(error){
            res.status(500).json({ error: 'Error al eliminar la tarea', details: error instanceof Error ? error.message : String(error) });
        }
    }
}