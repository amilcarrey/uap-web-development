/* recordar:
el repositorio de tareas es la capa que interactua
con la base de datos, para acceder a ellos de forma
aislada
true=1 y false=0
*/
import { database } from "../../db/connection";
import { Task } from "../../types";

function mapTask(taskFromDb: any): Task {
  return {
    id: taskFromDb.id,
    text: taskFromDb.text,
    completed: !!taskFromDb.completed,
    boardId: taskFromDb.board_id,
    created_at: taskFromDb.created_at,
    updated_at: taskFromDb.updated_at,
  };
}


export const TaskRepository = {
  // metodo para obtener todas las tareas de un tablero
  async getAll(): Promise<Task[]> {
    return await database.all<Task>("SELECT * FROM tasks");
  },
  // metodo para devolver las tareas filtradas y segun la pagina
  async getPaginated(
    filter: string,
    page: number,
    pageSize: number,
    boardId?: string,
    search?: string,
    userId?: string
    ): Promise< {tasks: Task[]; totalPages: number}> {
   let query = `
    SELECT t.*
    FROM tasks t
    JOIN boards b ON b.id = t.board_id
    JOIN board_permissions bp ON bp.board_id = b.id
  `;    
  
    const conditions: string[] = [];
    const params: any[] = [];

  if (userId) {
    conditions.push("bp.user_id = ?");
    params.push(userId);
  }
    if (filter === "done") {
      conditions.push("completed = 1"); //completado true
    }
    else if (filter === "undone") {
      conditions.push("completed = 0"); //completado false
    }
    //si existe board id, 
     if (boardId) {
    conditions.push("t.board_id = ?");
    params.push(boardId);
   }

    if (search) {
    conditions.push("LOWER(t.text) LIKE ?");
    params.push(`%${search.toLowerCase()}%`);
   }

    //si hay filtros dentro del array, le agregamos a la query
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    // hacemos un conteo de las tareas con x filtro
    const countQuery = `SELECT COUNT(*) as count FROM (${query}) AS temp`;
    const countResult = await database.get<{ count: number }>(countQuery, params);
    // basado en el conteo, calculamos el numero total de paginas
    const total = countResult?.count || 0;
    const totalPages = Math.ceil(total / pageSize);

    // paginacion 
    query += " LIMIT ? OFFSET ?";
    params.push(pageSize, (page - 1) * pageSize);

    const rawTasks = await database.all<Task>(query, params);
    const tasks = rawTasks.map(mapTask);
    return { tasks, totalPages };

    },


    // metodos para crear, actualizar, eliminar x tarea y segun si completada o no
    async create(text: string, boardId: string): Promise<Task> {
        await database.run(
          "INSERT INTO tasks (text, board_id) VALUES (?, ?)",
          [text, boardId]
        );
        const task = await database.get<Task>(
          "SELECT * FROM tasks ORDER BY id DESC LIMIT 1"
        );
        return mapTask(task);
    },
    
    
    // para actualizarla 
    // use partial para actualizar solo algunos de los campos de esa tarea, no todos
    async update(
        id: string,
        tasks: Partial<{ text: string; completed: boolean; board_id: string }>
    ): Promise<Task | null> {
        const updates: string[] = [];
        const params: any[] = [];

        // si hay campos para actualizar, los agregamos a la query
            if (tasks.text !== undefined) {
            updates.push("text = ?");
            params.push(tasks.text);
        }

        if (tasks.completed !== undefined) {
            updates.push("completed = ?");
            params.push(tasks.completed ? 1 : 0); // siendo true = 1, false = 0
        }

        if (tasks.board_id !== undefined) {
            updates.push("board_id = ?");
            params.push(tasks.board_id);
        }

        if (updates.length === 0) {
            return null; // No hay campos para actualizar
        }
        params.push(id); // Agregamos el ID al final de los parámetros

        await database.run(
            `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`,
            params
        );

    const task = await database.get<Task>("SELECT * FROM tasks WHERE id = ?", [id]);
    return task ? mapTask(task) : null;
  },

  async delete(id: string): Promise<void> {
    await database.run("DELETE FROM tasks WHERE id = ?", [id]);
  },

  async clearCompleted(boardId: string): Promise<void> {
    await database.run(
      `DELETE FROM tasks WHERE completed = 1 AND board_id = ?`,
      [boardId]
    );
  }

};

