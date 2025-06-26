import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  registrarUsuario,
  autenticarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarios,
} from '../services/usuariosService';

// GET /usuarios - Listar todos los usuarios
export async function getUsuarios(req: Request, res: Response) {
  try {
    const usuarios = await obtenerUsuarios();
    res.json({ usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// POST /usuarios - Registrar un nuevo usuario
export async function createUsuario(req: Request, res: Response) {
  try {
    const { nombre, email, password } = req.body;
    
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: "Nombre, email y password son requeridos" 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: "La contraseña debe tener al menos 6 caracteres" 
      });
    }

    const nuevoUsuario = await registrarUsuario(nombre.trim(), email.trim(), password);
    
    if (!nuevoUsuario) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // No devolvemos la contraseña hasheada
    const { password: _, ...usuarioSinPassword } = nuevoUsuario;
    res.status(201).json({ 
      success: true, 
      usuario: usuarioSinPassword 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
}

// POST /usuarios/login - Autenticar usuario
export async function loginUsuario(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email y password son requeridos" 
      });
    }

    const resultado = await autenticarUsuario(email.trim(), password);
    
    if (!resultado) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.cookie("token", resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    });

    res.json({ 
      success: true, 
      ...resultado 
    });
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    res.status(500).json({ error: "Error al autenticar usuario" });
  }
}

// GET /usuarios/:id - Obtener usuario por ID
export async function getUsuarioPorId(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID requerido" });
    }

    const usuario = await obtenerUsuarioPorId(id);
    
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { password: _, ...usuarioSinPassword } = usuario;
    res.json({ usuario: usuarioSinPassword });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
}

// POST /usuarios/logout - Cerrar sesión
export async function logoutUsuario(req: Request, res: Response) {
  try {
    res.clearCookie("token");
    res.json({ 
      success: true, 
      message: "Sesión cerrada correctamente" 
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
}

// GET /usuarios/check-auth - Verificar si el usuario está autenticado
export async function checkAuth(req: Request, res: Response) {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string };
    
    const usuario = await obtenerUsuarioPorId(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const { password: _, ...usuarioSinPassword } = usuario;
    res.json({ 
      success: true, 
      usuario: usuarioSinPassword 
    });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}
