import { Request, Response, NextFunction } from "express";
import { database } from "../db/connection";

/**
 * Middleware para verificar si el usuario tiene permiso sobre una tarea (usando su board)
 * Se usa cuando la tarea ya existe (por ID)
 */
export function checkTaskPermission(requiredRoles: ("owner" | "editor" | "viewer")[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const taskId = req.params.id;
    const userId = req.user?.id;

    if (!taskId || !userId) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    const result = await database.get<{ board_id: string }>(
      `SELECT board_id FROM tasks WHERE id = ?`,
      [taskId]
    );

    if (!result) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    const boardId = result.board_id;

    const permission = await database.get<{ role: string }>(
      `SELECT role FROM board_permissions WHERE board_id = ? AND user_id = ?`,
      [boardId, userId]
    );

    if (!permission || !requiredRoles.includes(permission.role as any)) {
      return res.status(403).json({ error: "No tienes permiso para esta acción" });
    }

    next();
  };
}
