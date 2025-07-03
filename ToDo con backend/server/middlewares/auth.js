import jwt from "jsonwebtoken";
import { SECRET } from "../config.js";
import { obtenerUsuarioPorIdService } from "../servieces/userServieces.js";

export async function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("🔒 Auth: No token found in cookies");
    console.log("🔒 Available cookies:", Object.keys(req.cookies));
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    console.log("🔒 Auth: Token decoded successfully for user:", decoded.id);

    // Obtener datos completos del usuario desde la base de datos
    const user = await obtenerUsuarioPorIdService(decoded.id);
    if (!user) {
      console.log("🔒 Auth: User not found in database:", decoded.id);
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    console.log("🔒 Auth: User data set in req.user:", user.id);
    next();
  } catch (err) {
    console.log("🔒 Auth: Token verification failed:", err.message);
    return res.status(403).json({ message: "Token inválido" });
  }
}
