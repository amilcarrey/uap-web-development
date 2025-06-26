import { Request, Response } from "express";
import * as userConfigService from "../service/userConfigService";

// GET /api/user/config
export const getUserConfig = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  try {
    // Usamos get para asegurar que siempre haya config
    const config = await userConfigService.getUserConfig(userId);
    res.json(config);
  } catch (error: any) {
    res.status(500).json({ error: "Error obteniendo configuración" });
  }
};

// PUT /api/user/config
export const updateUserConfig = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { allTasksUppercase, theme, autoRefreshInterval, tareasPorPagina } = req.body;

  // Validación básica
  const updates: any = {};
  if (typeof allTasksUppercase === "boolean") updates.allTasksUppercase = allTasksUppercase;
  if (theme === "light" || theme === "dark") updates.theme = theme;
  if (typeof autoRefreshInterval === "number" && autoRefreshInterval > 0) updates.autoRefreshInterval = autoRefreshInterval;
  if (typeof tareasPorPagina === "number" && tareasPorPagina > 0) updates.tareasPorPagina = tareasPorPagina;

  try {
    const config = await userConfigService.updateUserConfig(userId, updates);
    res.json(config);
  } catch (error: any) {
    res.status(400).json({ error: "No se pudo actualizar la configuración" });
  }
};

