import { NextResponse } from 'next/server';
import { Resena } from '../../models/Resena';
import mongoose from 'mongoose';

// Conexión a la base de datos (ajusta la URI según tu entorno)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/libro-resenas';

async function dbConnect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const body = await request.json();
  const { libroId, usuario, texto, rating } = body;
  if (!libroId || !usuario || !texto || !rating) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }
  const nuevaResena = new Resena({ libroId, usuario, texto, rating });
  await nuevaResena.save();
  return NextResponse.json(nuevaResena, { status: 201 });
}

export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const libroId = searchParams.get('libroId');
  if (!libroId) {
    return NextResponse.json({ error: 'Falta libroId' }, { status: 400 });
  }
  const resenas = await Resena.find({ libroId }).sort({ fecha: -1 });
  return NextResponse.json(resenas);
}

export async function PATCH(request: Request) {
  await dbConnect();
  const { reseñaId, tipo } = await request.json();
  if (!reseñaId || !['like', 'dislike'].includes(tipo)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }
  const update = tipo === 'like' ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
  const resena = await Resena.findByIdAndUpdate(reseñaId, update, { new: true });
  if (!resena) {
    return NextResponse.json({ error: 'Reseña no encontrada' }, { status: 404 });
  }
  return NextResponse.json(resena);
}
