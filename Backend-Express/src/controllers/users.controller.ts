import { Request, Response } from 'express';
import { registerUserService, loginUserService } from '../services/userService';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const user = await registerUserService(email, password);
    return res.status(201).json({ message: 'Usuario creado', userId: user.id });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son requeridos' });

  try {
    const result = await loginUserService(email, password);
    if (!result) return res.status(401).json({ error: 'Credenciales inválidas' });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      userId: result.userId,
      token: result.token,
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};
