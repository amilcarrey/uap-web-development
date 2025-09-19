// middleware/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "mi_secreto";

interface UserPayload {
  id: string;
  email?: string;
  name?: string;
}

export function requireAuth(req: Request): UserPayload {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No autorizado");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("No autorizado");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & UserPayload;
    if (!decoded.id) throw new Error("Token inválido");
    return { id: decoded.id, email: decoded.email, name: decoded.name };
  } catch (err) {
    throw new Error("No autorizado");
  }
}
