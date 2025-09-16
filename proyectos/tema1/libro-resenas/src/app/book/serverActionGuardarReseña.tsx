"use server";
import { connectDB } from "../../../db";
import { Resena } from "../models/Resena";
import { Reseña } from "../../app/types/Reseña";

// Guardar reseña
export async function serverActionGuardarReseña(
  libroId: string,
  usuario: string,
  texto: string,
  rating: number // ✅ usamos rating en vez de voto
) {
  await connectDB();

  if (!libroId || !usuario || !texto || rating === undefined || rating === null) {
    throw new Error("Faltan datos requeridos para guardar la reseña");
  }

  const nuevaResena = new Resena({
    libroId,
    usuario,
    texto,
    rating, // ✅ guardamos como rating
  });

  await nuevaResena.save();

  // Devolvemos todas las reseñas del libro ya con rating
  const reseñas = await Resena.find({ libroId });
  return reseñas.map(r => ({
    id: r._id.toString(),
    usuario: r.usuario,
    texto: r.texto,
    fecha: r.fecha.toISOString(), // ✅ string en vez de Date
    rating: r.rating,
    likes: r.likes,
    dislikes: r.dislikes,
  }));

}

// Obtener reseñas
export async function serverActionObtenerReseñas(libroId: string) {
  await connectDB();
  const reseñas = await Resena.find({ libroId });
  return reseñas.map(r => ({
    id: r._id.toString(),
    usuario: r.usuario,
    texto: r.texto,
    fecha: r.fecha,
    rating: r.rating,
    likes: r.likes,
    dislikes: r.dislikes,
  }));
}

// Votar reseña
export async function serverActionVotarReseña(
  libroId: string,
  reseñaId: string,
  tipo: "like" | "dislike"
) {
  await connectDB();
  const reseña = await Resena.findById(reseñaId);

  if (reseña) {
    if (tipo === "like") reseña.likes = (reseña.likes || 0) + 1;
    if (tipo === "dislike") reseña.dislikes = (reseña.dislikes || 0) + 1;
    await reseña.save();
  }

  const reseñas = await Resena.find({ libroId });
  return reseñas.map(r => ({
    id: r._id.toString(),
    usuario: r.usuario,
    texto: r.texto,
    fecha: r.fecha,
    rating: r.rating,
    likes: r.likes,
    dislikes: r.dislikes,
  }));
}
