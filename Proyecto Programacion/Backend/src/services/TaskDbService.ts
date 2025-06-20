import { CreateTaskDTO } from "../DTOs/task/CreateTaskSchema";
import { TaskDTO } from "../DTOs/task/TaskSchema";
import { TaskQueryDTO } from "../DTOs/task/TaskQuerySchema";
import { UpdateTaskDTO } from "../DTOs/task/UpdateTaskSchema";
import { ITaskService } from "../Interfaces/ITaskService";
import { Paginated } from "../Interfaces/Paginated";
import { prisma } from "../prisma";


export class TaskDbService implements ITaskService {
    // Crea una tarea en un tablero específico
    async createTask(userId: number, boardId: number, data: CreateTaskDTO): Promise<TaskDTO> {
        // 1. Verifica que el tablero exista y el usuario tenga acceso (opcional, según tu lógica)
        const board = await prisma.board.findUnique({ where: { id: boardId } });
        if (!board) throw new Error("Tablero no encontrado");
        // 2. Crea la tarea
        const task = await prisma.task.create({
            data: {
                boardId: boardId,
                content: data.content,
                active: data.active,
            }
        }); 
        // 3. Devuelve el DTO
        return this.mapToTaskDTO(task);
    }

    // Obtiene tareas paginadas de un tablero
    async getTask(userId: number, boardId: number, query: TaskQueryDTO): Promise<Paginated<TaskDTO>> {
        const page = query.page || 1;
        const pageSize = query.limit || 10;
        const where: any = { boardId };
        if (query.active !== undefined) where.active = query.active;
        if (query.search) where.content = { contains: query.search };
        const [items, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize
            }),
            prisma.task.count({ where })
        ]);
        return {
            items: items.map(this.mapToTaskDTO),
            total,
            page,
            pageSize
        };
    }

    // Obtiene una tarea por su ID
    async getTaskById(taskId: number): Promise<TaskDTO> {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new Error("Tarea no encontrada");
        return this.mapToTaskDTO(task);
    }

    // Actualiza una tarea
    async updateTask(taskId: number, data: UpdateTaskDTO): Promise<TaskDTO> {
        // 1. Verifica que la tarea exista
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new Error("Tarea no encontrada");

        // 2. Actualiza la tarea
        const updated = await prisma.task.update({
            where: { id: taskId },
            data
        });
        return this.mapToTaskDTO(updated);
    }

    // Elimina una tarea
    async deleteTask(taskId: number): Promise<void> {
        // 1. Verifica que la tarea exista
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new Error("Tarea no encontrada");

        // 2. Elimina la tarea
        await prisma.task.delete({ where: { id: taskId } });
    }

    // Función privada para mapear a DTO
    private mapToTaskDTO(task: any): TaskDTO {
        return {
            boardId: task.boardId,
            content: task.content,
            active: task.active
        };
    }
}