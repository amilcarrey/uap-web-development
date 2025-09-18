import { CreateTaskDTO } from "../DTOs/task/CreateTaskSchema";
import { TaskDTO } from "../DTOs/task/TaskSchema";
import { TaskQueryDTO } from "../DTOs/task/TaskQuerySchema";
import { UpdateTaskDTO } from "../DTOs/task/UpdateTaskSchema";
import { ITaskService } from "../Interfaces/ITaskService";
import { Paginated } from "../Interfaces/Paginated";
import { prisma } from "../prisma";

export class TaskDbService implements ITaskService {
    
    async createTask(userId: number, boardId: number, data: CreateTaskDTO): Promise<TaskDTO> {
        
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: { permissions: true }
        });
        if (!board) {
            const error = new Error("Tablero no encontrado");
            (error as any).status = 404;
            throw error;
        }
        const isOwner = board.ownerId === userId;
        const hasPermission = board.permissions.some((p: any) => p.userId === userId && (p.level === "EDITOR" || p.level === "OWNER"));
        if (!isOwner && !hasPermission) {
            const error = new Error("No tienes permiso para crear tareas en este tablero");
            (error as any).status = 403;
            throw error;
        }
        const task = await prisma.task.create({
            data: {
                boardId: boardId,
                content: data.content,
                active: data.active,
            }
        }); 
        return this.mapToTaskDTO(task);
    }

    
    async getTask(userId: number, boardId: number, query: TaskQueryDTO): Promise<Paginated<TaskDTO>> {
        
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: { permissions: true }
        });
        if (!board) {
            const error = new Error("Tablero no encontrado");
            (error as any).status = 404;
            throw error;
        }

        
        const isOwner = board.ownerId === userId;
        const hasPermission = board.permissions.some((p: any) => p.userId === userId);
        if (!isOwner && !hasPermission) {
            const error = new Error("No tienes permiso para ver las tareas de este tablero");
            (error as any).status = 403;
            throw error;
        }

        
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

    
    async updateTask(taskId: number, data: UpdateTaskDTO, userId: number): Promise<TaskDTO> {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) {
            const error = new Error("Tarea no encontrada");
            (error as any).status = 404;
            throw error;
        }
        
        const board = await prisma.board.findUnique({
            where: { id: task.boardId },
            include: { permissions: true }
        });
        if (!board) {
            const error = new Error("Tablero no encontrado");
            (error as any).status = 404;
            throw error;
        }
        const isOwner = board.ownerId === userId;
        const hasPermission = board.permissions.some((p: any) => p.userId === userId && (p.level === "EDITOR" || p.level === "OWNER"));
        if (!isOwner && !hasPermission) {
            const error = new Error("No tienes permiso para actualizar tareas en este tablero");
            (error as any).status = 403;
            throw error;
        }
        const updated = await prisma.task.update({
            where: { id: taskId },
            data
        });
        return this.mapToTaskDTO(updated);
    }

    
    async deleteTask(taskId: number, userId: number): Promise<void> {
        const task = await prisma.task.findUnique({ where: { id: taskId } });
        if (!task) {
            const error = new Error("Tarea no encontrada");
            (error as any).status = 404;
            throw error;
        }
        
        const board = await prisma.board.findUnique({
            where: { id: task.boardId },
            include: { permissions: true }
        });
        if (!board) {
            const error = new Error("Tablero no encontrado");
            (error as any).status = 404;
            throw error;
        }
        const isOwner = board.ownerId === userId;
        const hasPermission = board.permissions.some((p: any) => p.userId === userId && (p.level === "EDITOR" || p.level === "OWNER"));
        if (!isOwner && !hasPermission) {
            const error = new Error("No tienes permiso para eliminar tareas en este tablero");
            (error as any).status = 403;
            throw error;
        }
        await prisma.task.delete({ where: { id: taskId } });
    }

    
    async deleteCompletedTasks(userId: number, boardId: number): Promise<number> {
        
        const board = await prisma.board.findUnique({
            where: { id: boardId },
            include: { permissions: true }
        });
        if (!board) {
            const error = new Error("Tablero no encontrado");
            (error as any).status = 404;
            throw error;
        }
        const isOwner = board.ownerId === userId;
        const hasPermission = board.permissions.some((p: any) => p.userId === userId && (p.level === "EDITOR" || p.level === "OWNER"));
        if (!isOwner && !hasPermission) {
            const error = new Error("No tienes permiso para eliminar tareas en este tablero");
            (error as any).status = 403;
            throw error;
        }

        
        const result = await prisma.task.deleteMany({
            where: {
                boardId,
                active: true
            }
        });
        return result.count; 
    }

    
    private mapToTaskDTO(task: any): TaskDTO {
        return {
            id: task.id,
            boardId: task.boardId,
            content: task.content,
            active: task.active
        };
    }
}
