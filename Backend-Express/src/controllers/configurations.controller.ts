import { Request, Response } from 'express';
import { searchUserConfig, updateUserConfig } from '../services/configurationsService';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
  };
}

export const SearchConfig = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  try {
    const config = await searchUserConfig(userId);
    return res.status(200).json(config);
  } catch (error) {
    console.error('Error al buscar configuración del usuario:', error);
    return res.status(500).json({ message: 'Error al buscar configuración' });
  }
};

export const UpdateConfig = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.userId;
  const { refetchInterval, descripcionMayusculas, theme } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  try {
    const updatedConfig = await updateUserConfig(userId, refetchInterval, descripcionMayusculas, theme);
    return res.status(200).json(updatedConfig);
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    return res.status(500).json({ message: 'Error al actualizar configuración' });
  }
};
