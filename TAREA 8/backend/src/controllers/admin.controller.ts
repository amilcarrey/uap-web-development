import { Request, Response } from 'express';
import { prisma } from '../config/prisma';

export const listarUsuarios = async (req: Request, res: Response): Promise<void> => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        creadoEn: true,
        _count: {
          select: {
            tableros: true,  
            permisos: true   
          }
        }
      },
      orderBy: {
        creadoEn: 'desc'
      }
    });

    
    res.json({ usuarios });
  } catch (error: any) {
    console.error(' Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const estadisticasGenerales = async (req: Request, res: Response): Promise<void> => {
  try {
    
    
    const [totalUsuarios, totalTableros, totalTareas] = await Promise.all([
      prisma.usuario.count(),
      prisma.tablero.count(),
      prisma.tarea.count()
    ]);

    const estadisticas = {
      totalUsuarios,
      totalTableros,
      totalTareas,
      promedioTablerosPorUsuario: totalUsuarios > 0 ? (totalTableros / totalUsuarios).toFixed(2) : 0,
      promedioTareasPorTablero: totalTableros > 0 ? (totalTareas / totalTableros).toFixed(2) : 0
    };

    
    res.json({ estadisticas });
  } catch (error: any) {
    console.error(' Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
