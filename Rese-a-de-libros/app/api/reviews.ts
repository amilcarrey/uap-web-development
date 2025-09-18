import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/lib/reviewModel";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    const { libroId, comentario, calificacion } = await req.json();

    if (!libroId || !comentario || !calificacion) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    const nuevaReseña = new Review({
      libroId,
      usuario: decoded.email,
      comentario,
      calificacion,
    });

    await nuevaReseña.save();

    return NextResponse.json({ message: "Reseña guardada" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}
