import { Request, Response, NextFunction } from "express";
import { PermissionsRepository } from "../modules/permissions/permissions.repository";
import { AuthedRequest } from "../types/express";

export const requirePermission = (
  nivelRequerido: "lectura" | "editor" | "propietario"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = (req as AuthedRequest).user || {};
    const { tableroId } = req.params;

    if (!userId || !tableroId) {
      return res.status(400).json({
        error: "Faltan datos de autenticación o del tablero",
      });
    }

    const permissionsRepo = new PermissionsRepository();
   const permiso = await permissionsRepo.getPermissionForUser(userId, tableroId);

if (!permiso) {
  return res.status(403).json({
    error: "Sin permisos para acceder a este tablero",
  });
}


    const niveles = ["lectura", "editor", "propietario"];
    const nivelActual = niveles.indexOf(permiso.nivel);
    const nivelNecesario = niveles.indexOf(nivelRequerido);

    if (nivelActual < nivelNecesario) {
      return res.status(403).json({
        error: `Se requiere nivel ${nivelRequerido}`,
      });
    }

    next();
  };
};
