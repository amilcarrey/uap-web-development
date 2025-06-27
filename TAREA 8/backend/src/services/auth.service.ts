import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { Usuario } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'clave-super-secreta';

interface RegistroData {
  nombre: string;
  email: string;
  contraseña: string;
}

interface LoginData {
  email: string;
  contraseña: string;
}

export async function registrarUsuario(data: RegistroData) {
  const { nombre, email, contraseña } = data;

  const emailNormalizado = email.toLowerCase().trim();


  if (!nombre || !email || !contraseña) {
    throw new Error('Todos los campos son requeridos');
  }

  if (contraseña.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }


  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email: emailNormalizado }
  });

  if (usuarioExistente) {
    throw new Error('El email ya está registrado');
  }


  const usuario = await prisma.usuario.create({
    data: {
      nombre: nombre.trim(),
      email: emailNormalizado,
      contraseña: await bcrypt.hash(contraseña, 12)
    }
  });

  const { contraseña: _, ...usuarioSinPassword } = usuario;
  return usuarioSinPassword;
}

export async function loginUsuario(data: LoginData): Promise<{ token: string, usuario: Partial<Usuario> }> {
  const { email, contraseña } = data;
  
  if (!email || !contraseña) {
    throw new Error('Email y contraseña son requeridos');
  }

  // Normalizar email
  const emailNormalizado = email.toLowerCase().trim();

  const usuario = await prisma.usuario.findUnique({ 
    where: { email: emailNormalizado }
  });
  
  if (!usuario) {
    throw new Error('Credenciales inválidas');
  }

  const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!esValida) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email 
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );

  const { contraseña: _, ...usuarioSinPassword } = usuario;

  return {
    token,
    usuario: usuarioSinPassword
  };
}

export async function verificarToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        creadoEn: true,
        actualizadoEn: true
      }
    });

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return usuario;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado');
    }
    if (error instanceof jwt.NotBeforeError) {
      throw new Error('Token no válido aún');
    }
    throw new Error('Error al verificar el token');
  }
}
