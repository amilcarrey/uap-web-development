import { NextResponse } from 'next/server';
import { Usuario } from '../../models/Usuario';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/libro-resenas';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function dbConnect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const { mail, contrasena } = await request.json();
  if (!mail || !contrasena) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }
  const usuario = await Usuario.findOne({ mail });
  if (!usuario) {
    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
  }
  const valido = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!valido) {
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
  }
  const token = jwt.sign({ id: usuario._id, mail: usuario.mail }, JWT_SECRET, { expiresIn: '7d' });
  return NextResponse.json({ ok: true, token, usuario: { mail: usuario.mail } });
}
