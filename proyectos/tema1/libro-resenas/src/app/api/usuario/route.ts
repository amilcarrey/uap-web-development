import { NextResponse } from "next/server";
import { Usuario } from "../../models/Usuario";
import { Favorito } from "../../models/Favorito";
import mongoose from "mongoose";
import { authMiddleware } from "../authMiddleware";
import jwt from "jsonwebtoken";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/libro-resenas";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

async function dbConnect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

function getUserIdFromRequest(request: Request) {
  const res = authMiddleware(request as any);
  if (res) return null;
  const auth = request.headers.get("authorization");
  if (!auth) return null;
  const token = auth.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return (payload as any).id;
  } catch {
    return null;
  }
}

// Obtener perfil de usuario
export async function GET(request: Request) {
  await dbConnect();
  const res = authMiddleware(request as any);
  if (res) return res;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  // Poblar favoritos y reseñas
  const usuario = await Usuario.findById(userId)
    .populate("favoritos")
    .populate({
      path: "historialResenas",
      model: "Resena",
      populate: { path: "votaciones", model: "Votacion" }
    });
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  // Enriquecer favoritos con datos del libro
  const favoritosConLibro = await Promise.all(
    usuario.favoritos.map(async (fav: any) => {
      let libro = null;
      try {
        const resp = await fetch(`https://www.googleapis.com/books/v1/volumes/${fav.libroId}`);
        if (resp.ok) libro = await resp.json();
      } catch {}
      return {
        _id: fav._id,
        libroId: fav.libroId,
        fecha: fav.fecha,
        libro: libro ? {
          id: libro.id,
          titulo: libro.volumeInfo?.title,
          autores: libro.volumeInfo?.authors,
          imagen: libro.volumeInfo?.imageLinks?.thumbnail
        } : { id: fav.libroId }
      };
    })
  );
  // Obtener datos del libro para cada reseña
  const reseñasConLibro = await Promise.all(
    usuario.historialResenas.map(async (resena: any) => {
      let libro = null;
      try {
        const resp = await fetch(`https://www.googleapis.com/books/v1/volumes/${resena.libroId}`);
        if (resp.ok) libro = await resp.json();
      } catch {}
      return {
        _id: resena._id,
        texto: resena.texto,
        rating: resena.rating,
        fecha: resena.fecha,
        likes: resena.likes,
        dislikes: resena.dislikes,
        votaciones: resena.votaciones,
        libro: libro ? {
          id: libro.id,
          titulo: libro.volumeInfo?.title,
          autores: libro.volumeInfo?.authors,
          imagen: libro.volumeInfo?.imageLinks?.thumbnail
        } : { id: resena.libroId }
      };
    })
  );
  // Reemplazar historialResenas y favoritos por los arrays enriquecidos
  const usuarioObj = usuario.toObject();
  usuarioObj.historialResenas = reseñasConLibro;
  usuarioObj.favoritos = favoritosConLibro;
  return NextResponse.json(usuarioObj);
}

// Editar perfil (solo mail por simplicidad)
export async function PATCH(request: Request) {
  await dbConnect();
  const res = authMiddleware(request as any);
  if (res) return res;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { mail } = await request.json();
  if (!mail) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const usuario = await Usuario.findByIdAndUpdate(userId, { mail }, { new: true });
  return NextResponse.json(usuario);
}

// Agregar libro a favoritos
export async function POST(request: Request) {
  await dbConnect();
  const res = authMiddleware(request as any);
  if (res) return res;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { libroId } = await request.json();
  if (!libroId) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  // Evitar duplicados
  const yaFav = await Favorito.findOne({ usuarioId: userId, libroId });
  if (yaFav) {
    return NextResponse.json({ error: "Ya está en favoritos" }, { status: 409 });
  }
  const favorito = new Favorito({ usuarioId: userId, libroId });
  await favorito.save();
  await Usuario.findByIdAndUpdate(userId, { $push: { favoritos: favorito._id } });
  return NextResponse.json(favorito, { status: 201 });
}

// Eliminar libro de favoritos
export async function DELETE(request: Request) {
  await dbConnect();
  const res = authMiddleware(request as any);
  if (res) return res;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { libroId } = await request.json();
  if (!libroId) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }
  const favorito = await Favorito.findOneAndDelete({ usuarioId: userId, libroId });
  if (!favorito) {
    return NextResponse.json({ error: "No está en favoritos" }, { status: 404 });
  }
  await Usuario.findByIdAndUpdate(userId, { $pull: { favoritos: favorito._id } });
  return NextResponse.json({ ok: true });
}
