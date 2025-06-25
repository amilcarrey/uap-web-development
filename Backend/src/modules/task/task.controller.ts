import { Request, Response } from "express";
import { TaskService } from "./task.service";

export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    getAllTasks = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = req.params.boardId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const offset = (page - 1) * limit;

            const filter = (req.query.filter as string) || "all";

            const searchQuery = (req.query.search as string) || "";
            let tasks;
            if (searchQuery) {
                tasks = await this.taskService.searchTasks(boardId, searchQuery, limit, offset);
            } else {
                tasks = await this.taskService.getAllTasks(boardId, limit, offset, filter);
            }

            const total = await this.taskService.countTask(boardId, filter);
            const totalPages = Math.ceil(total / limit);
            res.json({ tasks, totalPages });
        } catch (error) {
            console.error("Error getting tasks:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    createTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = req.params.boardId;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }

            const userRole = await this.taskService.getUserBoardRole(userId, boardId);


            if (userRole === 'viewer' || userRole === 'read') {
                res.status(403).json({ error: "No tienes permisos para crear tareas en este tablero" });
                return;
            }
            const { name } = req.body;

            if (!name) {
                res.status(400).json({ error: "Task name is required" });
                return;
            }

            const newTask = await this.taskService.createTask({ board_id: boardId, name });
            console.log("Task created:", newTask);

            res.status(201).json(newTask);
        } catch (error) {
            console.error("Error creating task:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

    deleteTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const taskId = req.params.taskId;

            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }

            const boardId = await this.taskService.getTaskBoardId(taskId);
            if (!boardId) {
                res.status(404).json({ error: "Tarea no encontrada" });
                return;
            }

            const userRole = await this.taskService.getUserBoardRole(userId, boardId);
            if (userRole === 'viewer' || userRole === 'read') {
                res.status(403).json({ error: "No tienes permisos para eliminar tareas en este tablero" });
                return;
            }


            const deleted = await this.taskService.deleteTask(taskId);
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: "Task not found" });
            }
        } catch (error) {
            console.error("Error borrando la tarea:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

    completeTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const taskId = req.params.taskId;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }

            const boardId = await this.taskService.getTaskBoardId(taskId);
            if (!boardId) {
                res.status(404).json({ error: "Tarea no encontrada" });
                return;
            }

            const userRole = await this.taskService.getUserBoardRole(userId, boardId);
            if (userRole === 'viewer' || userRole === 'read') {
                res.status(403).json({ error: "No tienes permisos para completar tareas en este tablero" });
                return;
            }




            const completed = await this.taskService.completeTask(taskId);
            if (completed) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: "Task not found" });
            }
        } catch (error) {
            console.error("Error borrando la tarea:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }

    updateTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const taskId = req.params.taskId;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }
            const boardId = await this.taskService.getTaskBoardId(taskId);
            if (!boardId) {
                res.status(404).json({ error: "Tarea no encontrada" });
                return;
            }
            const userRole = await this.taskService.getUserBoardRole(userId, boardId);
            if (userRole === 'viewer' || userRole === 'read') {
                res.status(403).json({ error: "No tienes permisos para editar tareas en este tablero" });
                return;
            }

            const { name } = req.body;

            if (!name) {
                res.status(400).json({ error: "La tarea esta vacia" });
                return;
            }

            await this.taskService.updateTask(taskId, name);
            res.status(204).send();
        } catch (error) {
            console.error("Error editanto tarea:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }

    clearCompleted = async (req: Request, res: Response): Promise<void> => {
        try {
            const boardId = req.params.boardId;
            const userId = req.user?.id;

            if (!userId) {
                res.status(401).json({ error: "Usuario no autenticado" });
                return;
            }

            const userRole = await this.taskService.getUserBoardRole(userId, boardId);
            if (userRole === 'viewer' || userRole === 'read') {
                res.status(403).json({ error: "No tienes permisos para eliminar tareas completadas en este tablero" });
                return;
            }


            await this.taskService.clearCompleted(boardId);
            res.status(204).send();
        } catch (error) {
            console.error("Error al borrar tareas completadas:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

}