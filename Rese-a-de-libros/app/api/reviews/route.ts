import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import Review from "@/lib/reviewModel";

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const payload = token ? verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { libroId, comentario, calificacion } = await req.json();

  if (!libroId || !comentario || !calificacion)
    return NextResponse.json({ error: "Campos incompletos" }, { status: 400 });

  const review = await Review.create({
    libroId,
    usuarioEmail: payload.email,
    comentario,
    calificacion,
  });

  return NextResponse.json({ review });
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const payload = token ? verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { reviewId, comentario, calificacion } = await req.json();

  const review = await Review.findById(reviewId);
  if (!review) return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });
  if (review.usuarioEmail !== payload.email)
    return NextResponse.json({ error: "No puedes editar esta reseña" }, { status: 403 });

  if (comentario) review.comentario = comentario;
  if (calificacion) review.calificacion = calificacion;

  await review.save();
  return NextResponse.json({ review });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  const payload = token ? verifyToken(token) : null;

  if (!payload) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { reviewId } = await req.json();
  const review = await Review.findById(reviewId);

  if (!review) return NextResponse.json({ error: "Reseña no encontrada" }, { status: 404 });
  if (review.usuarioEmail !== payload.email)
    return NextResponse.json({ error: "No puedes eliminar esta reseña" }, { status: 403 });

  await review.deleteOne();
  return NextResponse.json({ message: "Reseña eliminada" });
}
