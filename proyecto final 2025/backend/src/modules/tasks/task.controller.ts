/* recordar:
archivo encargado de las peticiones relacionadas
a las tareas 
*/

import { Request, Response } from "express";
import { TaskRepository } from "./task.repository";

export const TaskController = {
  // Obtener tareas paginadas y filtradas
  async getAll(req: Request, res: Response) {
    const filter = req.query.filter?.toString() || "all";
    const page = parseInt(req.query.page?.toString() || "1");
    const limit = parseInt(req.query.limit?.toString() || "5");
    const boardId = req.query.boardId?.toString();
    const search = req.query.search?.toString();

    try {
      const { tasks, totalPages } = await TaskRepository.getPaginated(
        filter, 
        page, 
        limit, 
        boardId,
        search
      );
      res.json({ tasks, totalPages });
    } catch (err) {
      console.error("Error en getAll:", err); 
      res.status(500).json({ error: "Error al obtener las tareas" });
    }
  },

  // Crear nueva tarea
  async create(req: Request, res: Response) {
    console.log("Datos recibidos:", req.body); // Para depuración
    const { text, boardId, board_id } = req.body;
    const finalBoardId = boardId || board_id;
    if (!text || !boardId ) {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    try {
      const task = await TaskRepository.create(text, boardId);
      res.status(201).json(task);
    } catch (err) {
      res.status(500).json({ error: "Error al crear la tarea" });
    }
  },

  
  // Marcar tarea como completada o modificarla
  async update(req: Request, res: Response) {
    const id = (req.params.id);
    if (typeof id !== "string") {
      return res.status(400).json({ error: "ID inválido" });
    }
    const { text, boardId, action } = req.body;

    try {
      if (action === "complete") {
        const task = await TaskRepository.update(id, { completed: req.body.completed });
        return res.json( {task} );
      } else if (action === "edit") {
        const task = await TaskRepository.update(id, { text, board_id: boardId });
        return res.json(task);
      } else {
        return res.status(400).json({ error: "Acción no válida" });
      }
    } catch (err) {
      res.status(500).json({ error: "Error al actualizar la tarea" });
    }
  },

  // Eliminar tarea
  async remove(req: Request, res: Response) {
    const id = parseInt(req.params.id); 
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      await TaskRepository.delete(id.toString());
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar la tarea" });
    }
  },

  // Limpiar tareas completadas
    async clearCompleted(req: Request, res: Response) {
    const { boardId } = req.body;
    if (!boardId) {
      return res.status(400).json({ error: "Falta boardId" });
    }

    try {
      await TaskRepository.clearCompleted(boardId);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Error al limpiar tareas" });
    }
  },
};
