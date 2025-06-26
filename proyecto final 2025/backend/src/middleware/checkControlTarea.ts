import { Request, Response, NextFunction } from "express";
import { database } from "../db/connection";

export function checkCreateTaskPermission(requiredRoles: ("owner" | "editor")[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const boardId = req.body.boardId || req.body.board_id;
    const userId = req.user?.id;

    if (!boardId || !userId) {
      return res.status(400).json({ error: "Faltan parámetros" });
    }

    const result = await database.get<{ role: string }>(
      `SELECT role FROM board_permissions WHERE board_id = ? AND user_id = ?`,
      [boardId, userId]
    );

    if (!result || !requiredRoles.includes(result.role as any)) {
      return res.status(403).json({ error: "No tienes permiso para crear tareas en este tablero" });
    }

    next();
  };
}
