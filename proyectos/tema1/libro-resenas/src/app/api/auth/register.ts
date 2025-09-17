import { NextResponse } from 'next/server';
import { connectDB } from '../../../../db';
import { Usuario } from '../../models/Usuario';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await connectDB();
  const { mail, contrasena } = await request.json();

  // Verifica si el usuario ya existe
  const existe = await Usuario.findOne({ mail });
  if (existe) {
    return NextResponse.json({ error: 'El usuario ya existe' }, { status: 400 });
  }

  // Hashear la contraseña
  const hash = await bcrypt.hash(contrasena, 10);

  // Crea el usuario
  const nuevoUsuario = new Usuario({ mail, contrasena: hash });
  await nuevoUsuario.save();

  return NextResponse.json({ ok: true, usuario: { mail } });
}