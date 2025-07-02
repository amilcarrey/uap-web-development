import jwt from "jsonwebtoken";

const JWT_SECRET = "secretito"; // reemplazar con .env en producción

export function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Token inválido" });
  }
}