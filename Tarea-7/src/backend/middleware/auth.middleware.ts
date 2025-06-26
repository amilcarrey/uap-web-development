import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AuthedRequest } from "../types/express/index";
import { database } from "../db/connection";


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.signedCookies?.token || req.cookies?.token;

    if (!token) {
      res.status(401).json({ error: "Token missing" });
      return;
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    req.user = { userId: payload.userId };
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};


export const authorize = (
  requiredPermission: "owner" | "editor" | "viewer"
) => {
  return async (
    req: AuthedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.userId;
    const tableroId = req.params.tableroId;

    if (!tableroId) {
      res.status(400).json({ error: "Missing tablero ID" });
      return;
    }

    try {
      const permiso = await database.get<{ permiso: string }>(
        `SELECT permiso FROM permisos WHERE usuarioId = ? AND tableroId = ?`,
        [userId, tableroId]
      );

      if (!permiso) {
        res.status(403).json({ error: "No tienes permisos" });
        return;
      }

      const jerarquia = { owner: 3, editor: 2, viewer: 1 };
      const actual = permiso.permiso as keyof typeof jerarquia;

      if (jerarquia[actual] >= jerarquia[requiredPermission]) {
        next();
      } else {
        res.status(403).json({ error: "Permiso insuficiente" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error de autorización" });
    }
  };
};
