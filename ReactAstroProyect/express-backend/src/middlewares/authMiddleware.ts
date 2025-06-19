import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secreto-inseguro";

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;  // agarramos nuestra cookie llamada "token"

  if (!token) {
     res.status(401).json({ error: "No autenticado: falta token" });
     return;
  }

  try {
    // Verificamos el token JWT con la clave secreta
    const decoded = jwt.verify(token, JWT_SECRET);
    // Guardamos los datos decodificados (id, email, role) en req para que las rutas los usen puedan saber quién es el usuario autenticado
    // decimos que ahora req tiene una propiedad user de tipo any que es el payload del token decodificado
    req.user = decoded;
    // Seguimos con la siguiente función de la ruta
    next();
  } catch (err) {
  res.status(401).json({ error: "Token inválido" });
  }
}
