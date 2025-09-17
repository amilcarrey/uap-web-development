import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export function authMiddleware(req: NextRequest) {
  let token = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
  } else {
    // Buscar el token en la cookie
    const cookie = req.headers.get("cookie");
    if (cookie) {
      const match = cookie.match(/(?:^|; )token=([^;]*)/);
      if (match) token = match[1];
    }
  }
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    (req as any).usuario = payload;
    return null;
  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}
