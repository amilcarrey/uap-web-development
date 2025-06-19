import { Request, Response, NextFunction, RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";


export const requireAdmin: RequestHandler = (req, res, next) => {
  if (!req.user || typeof req.user === "string" || (req.user as JwtPayload).role !== "admin") {
    res.status(403).json({ error: "Acceso denegado: solo administradores" });
    return;
  }
  next(); // Llama a la siguiente función de la ruta
};
