import { Request, Response } from 'express';
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  resetearConfiguracion
} from '../services/configuracion.service';

export async function obtenerConfiguracionHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const configuracion = await obtenerConfiguracion(usuarioId);
    res.status(200).json({ configuracion });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function actualizarConfiguracionHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;
    const { intervaloActualizacion } = req.body;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (typeof intervaloActualizacion !== 'number' || intervaloActualizacion < 5 || intervaloActualizacion > 300) {
      res.status(400).json({ error: 'El intervalo de actualización debe ser un número entre 5 y 300 segundos' });
      return;
    }

    const configuracion = await actualizarConfiguracion(usuarioId, { intervaloActualizacion });
    res.status(200).json({
      mensaje: 'Configuración actualizada exitosamente',
      configuracion
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function resetearConfiguracionHandler(req: Request, res: Response): Promise<void> {
  try {
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const configuracion = await resetearConfiguracion(usuarioId);
    res.status(200).json({
      mensaje: 'Configuración restablecida a valores por defecto',
      configuracion
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
