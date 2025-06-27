import { Request, Response } from 'express';
import { registrarUsuario, loginUsuario, verificarToken } from '../services/auth.service';

export async function registroHandler(req: Request, res: Response): Promise<void> {
  try {
    const { nombre, email, contraseña } = req.body;
    
    if (!nombre || !email || !contraseña) {
      res.status(400).json({ error: 'Faltan campos requeridos' });
      return;
    }

    const nuevoUsuario = await registrarUsuario(req.body);
    
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'clave-super-secreta';
    
    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    res.status(201).json({ 
      mensaje: 'Usuario registrado con éxito', 
      usuario: nuevoUsuario
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function loginHandler(req: Request, res: Response): Promise<void> {
  try {
    const { email, contraseña } = req.body;
    
    if (!email || !contraseña) {
      res.status(400).json({ error: 'Email y contraseña son requeridos' });
      return;
    }
    
    const resultado = await loginUsuario({ email, contraseña });
    
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'clave-super-secreta';
    
    const token = jwt.sign(
      { id: resultado.usuario.id, email: resultado.usuario.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    });

    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: resultado.usuario
    });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
}

export async function logoutHandler(_req: Request, res: Response): Promise<void> {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    
    res.status(200).json({ mensaje: 'Sesión cerrada exitosamente' });
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cerrar sesión' });
  }
}

export async function perfilHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuario = req.usuario;
    
    if (!usuario) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    res.status(200).json({ 
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        creadoEn: usuario.creadoEn,
        actualizadoEn: usuario.actualizadoEn
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
