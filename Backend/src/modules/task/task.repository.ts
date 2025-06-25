import { database } from '../../db/connection';
import { Task, CreateTaskRequest } from "../../types";
import { v4 as uuidv4 } from "uuid";

interface BoardUserRole {
  role: string;
}

interface TaskBoardId {
  board_id: string;
}

export class TaskRepository {
    async getAllTasks(boardId: string, limit: number, offset: number, filter: string): Promise<Task[]> {
        let query = "SELECT * FROM tasks WHERE board_id = ?";
        const params: any[] = [boardId];
        if (filter === "completed") {
            query += " AND completed = 1";
        } else if (filter === "incompleted") {
            query += " AND completed = 0";
        }
        query += " LIMIT ? OFFSET ?";
        params.push(limit, offset);

        return database.all<Task>(query, params);
    }

    async getTaskById(id: string): Promise<Task | undefined> {
        return database.get<Task>("SELECT * FROM tasks WHERE id = ?", [id]);
    }

    async createTask(taskData: CreateTaskRequest): Promise<Task> {
        const id = uuidv4();
        const now = new Date().toISOString();

        await database.run(
            "INSERT INTO tasks (id, board_id, name, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            [id, taskData.board_id, taskData.name, false, now, now]
        )
        const task = await this.getTaskById(id);
        if (!task) {
            throw new Error("Task creation failed");
        }
        return task;
    }

    async completeTask(id: string): Promise<boolean> {
        try {
            const task = await this.getTaskById(id);
            if (!task) {
                return false; 
            }

            const now = new Date().toISOString();
            const newStatus = !task.completed;

            await database.run(
                "UPDATE tasks SET completed = ?, updated_at = ? WHERE id = ?",
                [newStatus, now, id]
            );
            return true; 
        }catch (error) {
            console.error("Error completando tarea:", error);
            throw error; 
        }
    }


    async deleteTask(id: string): Promise<boolean> {
        await database.run("DELETE FROM tasks WHERE id = ?", [id]);
        return true;
    }

    async updateTask(id: string, name: string): Promise<void> {
        const now = new Date().toISOString();
        await database.run(
            "UPDATE tasks SET name = ?, updated_at = ? WHERE id = ?",
            [name, now, id]
        );
    }

    async clearCompletedTasks(boardId: string): Promise<void> {
        await database.run("DELETE FROM tasks WHERE board_id = ? AND completed = 1", [boardId]);
    }

    async countTasks(boardId: string, filter: string): Promise<number> {
        let query = "SELECT COUNT(*) as total FROM tasks WHERE board_id = ?";
        const params: any[] = [boardId];

        if (filter === "completed") {
            query += " AND completed = 1";
        } else if (filter === "incompleted") {
            query += " AND completed = 0";
        }

        const result = await database.get<{ total: number }>(query, params);
        return result?.total ?? 0;

    }

    async getUserBoardRole(userId: string, boardId: string): Promise<string | null> {
    try {
        const result = await database.get<BoardUserRole>(
            "SELECT role FROM permissions WHERE user_id = ? AND board_id = ?",
            [userId, boardId]
        );
        
        return result ? result.role : null;
    } catch (error) {
        console.error("Error al obtener rol de usuario en tablero:", error);
        throw error;
    }
}

    

async getTaskBoardId(taskId: string): Promise<string | null> {
    try {
        const result = await database.get<TaskBoardId>(
            "SELECT board_id FROM tasks WHERE id = ?",
            [taskId]
        );
        
        return result ? result.board_id : null;
    } catch (error) {
        console.error("Error al obtener el tablero de la tarea:", error);
        throw error;
    }
}

async searchTasks(boardId: string, searchQuery: string, limit: number, offset: number): Promise<Task[]> {
  return database.all<Task>(
    `SELECT * FROM tasks 
     WHERE board_id = ? AND name LIKE ? 
     ORDER BY id DESC LIMIT ? OFFSET ?`,
    [boardId, `%${searchQuery}%`, limit, offset]
  );
}

   
}


    





























/* 
🔧 1. Repository (task.repository.ts)
Acá vas a escribir las funciones que interactúan directamente con la base de datos:



💡 Esta capa no sabe nada del negocio, solo se conecta con la base.

🧠 2. Service (task.service.ts)
Usa el repositorio para aplicar lógica de negocio:

Validar si la tarea ya existe

Confirmar que el usuario tiene permiso

Preparar los datos que se van a guardar

💡 Esta capa sabe del negocio, pero no de Express ni de HTTP.

🎮 3. Controller (task.controller.ts)
Usa el service y maneja las rutas:

Recibe el req, saca los datos

Llama al service

Devuelve la respuesta

💡 Esta capa sabe de HTTP, pero no de cómo está hecha la base.

*/