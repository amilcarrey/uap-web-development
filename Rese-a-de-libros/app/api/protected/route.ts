import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const token = authHeader.split(" ")[1];
  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  return NextResponse.json({ message: "Acceso permitido", user });
}
