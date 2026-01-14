import { NextResponse } from 'next/server';
import { Resena } from '../../models/Resena';
import { Votacion } from '../../models/Votacion';
import mongoose from 'mongoose';
import { authMiddleware } from '../authMiddleware';
import jwt from 'jsonwebtoken';

// Conexión a la base de datos (ajusta la URI según tu entorno)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/libro-resenas';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function dbConnect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

// Middleware centralizado para obtener usuario
function getUserIdFromRequest(request: Request) {
  // Buscar token en header Authorization
  let token = null;
  const auth = request.headers.get('authorization');
  if (auth && auth.startsWith('Bearer ')) {
    token = auth.replace('Bearer ', '');
  } else {
    // Buscar token en cookie
    const cookie = request.headers.get('cookie');
    if (cookie) {
      const match = cookie.match(/(?:^|; )token=([^;]*)/);
      if (match) token = match[1];
    }
  }
  if (!token) return null;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return (payload as any).id;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const res = authMiddleware(request as any);
  if (res) return res;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { libroId, texto, rating } = await request.json();
  if (!libroId || !texto || !rating) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }
  const nuevaResena = new Resena({ libroId, usuarioId: userId, texto, rating });
  await nuevaResena.save();
  // Agregar la reseña al historial del usuario
  await mongoose.model('Usuario').findByIdAndUpdate(userId, { $push: { historialResenas: nuevaResena._id } });
  return NextResponse.json(nuevaResena, { status: 201 });
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const libroId = searchParams.get('libroId');
  if (!libroId) {
    return NextResponse.json({ error: 'Falta libroId' }, { status: 400 });
  }
  const resenas = await Resena.find({ libroId })
    .sort({ fecha: -1 })
    .populate('usuarioId', 'mail');
  return NextResponse.json(resenas);
}

export async function PATCH(request: Request) {
  await dbConnect();
  const res = authMiddleware(request as any);
  if (res) return res;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const body = await request.json();
  // Votar reseña
  if (body.reseñaId && body.tipo && ['like', 'dislike'].includes(body.tipo)) {
    const { reseñaId, tipo } = body;
    // Verificar si el usuario ya votó esa reseña
    const yaVoto = await Votacion.findOne({ reseñaId, usuarioId: userId });
    if (yaVoto) {
      return NextResponse.json({ error: 'Ya votaste esta reseña' }, { status: 403 });
    }
    // Registrar el voto
    const voto = new Votacion({ reseñaId, usuarioId: userId, tipo });
    await voto.save();
    // Actualizar contador en la reseña
    const update = tipo === 'like' ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
    await Resena.findByIdAndUpdate(reseñaId, update);
    return NextResponse.json({ ok: true });
  }
  // Editar reseña
  if (body.reseñaId && (body.texto || body.rating)) {
    const { reseñaId, texto, rating } = body;
    const resena = await Resena.findById(reseñaId);
    if (!resena) {
      return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
    }
    if (resena.usuarioId.toString() !== userId) {
      return NextResponse.json({ error: 'No puedes editar esta reseña' }, { status: 403 });
    }
    if (texto) resena.texto = texto;
    if (rating) resena.rating = rating;
    await resena.save();
    return NextResponse.json(resena);
  }
  return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
}

// Eliminar reseña propia
export async function DELETE(request: Request) {
  await dbConnect();
  const res = authMiddleware(request as any);
  if (res) return res;
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const { reseñaId } = await request.json();
  if (!reseñaId) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const resena = await Resena.findById(reseñaId);
  if (!resena) {
    return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
  }
  if (resena.usuarioId.toString() !== userId) {
    return NextResponse.json({ error: 'No puedes eliminar esta reseña' }, { status: 403 });
  }
  await resena.deleteOne();
  return NextResponse.json({ ok: true });
}
