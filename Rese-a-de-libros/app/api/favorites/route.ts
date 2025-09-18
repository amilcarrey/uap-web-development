import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import User from "@/lib/userModel";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const payload = token ? verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { libroId } = await req.json();
  if (!libroId) return NextResponse.json({ error: "Libro requerido" }, { status: 400 });

  const user = await User.findOne({ email: payload.email });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  if (!user.favorites.includes(libroId)) user.favorites.push(libroId);
  await user.save();

  return NextResponse.json({ favorites: user.favorites });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const payload = token ? verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { libroId } = await req.json();
  const user = await User.findOne({ email: payload.email });
  if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  user.favorites = user.favorites.filter((id) => id !== libroId);
  await user.save();

  return NextResponse.json({ favorites: user.favorites });
}
