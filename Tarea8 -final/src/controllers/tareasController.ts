import { Request, Response } from "express";
import * as tareasService from "../service/tareasService"; 
import { prisma } from "../prisma";

// GET /api/tareas
export const getTareas = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    // Buscar la configuración del usuario
    const userConfig = await prisma.userConfig.findUnique({ where: { userId } });

    // Si viene el limit en query, úsalo, si no usa el de config, y si tampoco, por defecto 5
    let limit = 5;
    if (typeof req.query.limit === "string" && Number(req.query.limit) > 0) {
      limit = parseInt(req.query.limit as string, 10);
    } else if (userConfig?.tareasPorPagina && userConfig.tareasPorPagina > 0) {
      limit = userConfig.tareasPorPagina;
    }

    const result = await tareasService.getTareas({
      filter: req.query.filter as string,
      page: parseInt((req.query.page as string) || "1"),
      limit,
      mode: (req.query.mode as string) || "personal",
      userId,
      search: (req.query.search as string) || ""
    });

    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

// POST /api/tareas/:id
export const postTarea = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    const result = await tareasService.handleTareaAction({
      ...req.body,
      userId
    });
    res.json(result);
  } catch (error: any) {
    let status = 400;
    if (error.message === "Tablero no encontrado") status = 404;
    if (error.message.includes("permiso")) status = 403;
    res.status(status).json({ error: error.message });
  }
};
