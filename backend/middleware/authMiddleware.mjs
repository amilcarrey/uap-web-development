import jwt from "jsonwebtoken";

const JWT_SECRET = "secretito";

export function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "No autorizado" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Token inválido" });
  }
}