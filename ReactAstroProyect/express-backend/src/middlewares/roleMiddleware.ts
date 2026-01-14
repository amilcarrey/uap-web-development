import { Request, Response, NextFunction } from "express";
import { checkCategoryPermission } from "../models/categoryModel.js";

export const authorizeCategoryAccess = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { id: string };
    const { categoriaId } = req.params;

    const hasPermission = await checkCategoryPermission(categoriaId, user.id, requiredRole);

    if (!hasPermission) {
      res.status(403).json({ error: `Acceso denegado: se requiere el rol ${requiredRole}` });
      return;
    }

    next();
  };
};
