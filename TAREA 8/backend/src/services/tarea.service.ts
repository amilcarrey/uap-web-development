import { prisma } from '../config/prisma';
import { Rol, Prioridad } from '@prisma/client';

interface CrearTareaData {
  titulo: string;
  descripcion?: string;
  prioridad?: Prioridad;
}

interface ActualizarTareaData {
  titulo?: string;
  descripcion?: string;
  prioridad?: Prioridad;
  completada?: boolean;
}

interface FiltrosTareas {
  completada?: boolean;
  prioridad?: Prioridad;
  busqueda?: string;
  page?: number;
  limit?: number;
  ordenarPor?: 'creadoEn' | 'titulo' | 'prioridad' | 'completadoEn';
  orden?: 'asc' | 'desc';
}

export async function verificarAccesoTablero(tableroId: string, usuarioId: number, rolesPermitidos: Rol[] = [Rol.PROPIETARIO, Rol.EDITOR, Rol.LECTOR]) {
  const tablero = await prisma.tablero.findUnique({
    where: { id: tableroId },
    include: {
      permisos: {
        where: { usuarioId }
      }
    }
  });

  if (!tablero) {
    throw new Error('Tablero no encontrado');
  }


  if (tablero.creadoPorId === usuarioId) {
    return Rol.PROPIETARIO;
  }


  const permiso = tablero.permisos[0];
  if (!permiso || !rolesPermitidos.includes(permiso.rol)) {
    throw new Error('No tienes permisos para realizar esta acción');
  }

  return permiso.rol;
}

export async function crearTarea(tableroId: string, usuarioId: number, data: CrearTareaData) {

  await verificarAccesoTablero(tableroId, usuarioId, [Rol.PROPIETARIO, Rol.EDITOR]);

  const { titulo, descripcion, prioridad = Prioridad.MEDIA } = data;

  if (!titulo || titulo.trim().length === 0) {
    throw new Error('El título de la tarea es requerido');
  }

  const tarea = await prisma.tarea.create({
    data: {
      titulo: titulo.trim(),
      descripcion: descripcion?.trim(),
      prioridad,
      tableroId
    },
    include: {
      tablero: {
        select: {
          id: true,
          nombre: true
        }
      }
    }
  });

  return tarea;
}

export async function obtenerTareas(tableroId: string, usuarioId: number, filtros: FiltrosTareas = {}) {

  await verificarAccesoTablero(tableroId, usuarioId);

  const {
    completada,
    prioridad,
    busqueda,
    page = 1,
    limit = 50,
    ordenarPor = 'creadoEn',
    orden = 'desc'
  } = filtros;

  const skip = (page - 1) * limit;


  const where: any = {
    tableroId
  };

  if (completada !== undefined) {
    where.completada = completada;
  }

  if (prioridad) {
    where.prioridad = prioridad;
  }

  if (busqueda && busqueda.trim().length > 0) {
    where.OR = [
      {
        titulo: {
          contains: busqueda.trim(),
          mode: 'insensitive'
        }
      },
      {
        descripcion: {
          contains: busqueda.trim(),
          mode: 'insensitive'
        }
      }
    ];
  }


  const orderBy: any = {};
  orderBy[ordenarPor] = orden;

  const [tareas, total] = await Promise.all([
    prisma.tarea.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        tablero: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    }),
    prisma.tarea.count({ where })
  ]);

  return {
    tareas,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function obtenerTarea(tareaId: string, usuarioId: number) {
  const tarea = await prisma.tarea.findUnique({
    where: { id: tareaId },
    include: {
      tablero: {
        select: {
          id: true,
          nombre: true
        }
      }
    }
  });

  if (!tarea) {
    throw new Error('Tarea no encontrada');
  }


  await verificarAccesoTablero(tarea.tableroId, usuarioId);

  return tarea;
}

export async function actualizarTarea(tareaId: string, usuarioId: number, data: ActualizarTareaData) {
  const tarea = await prisma.tarea.findUnique({
    where: { id: tareaId }
  });

  if (!tarea) {
    throw new Error('Tarea no encontrada');
  }


  await verificarAccesoTablero(tarea.tableroId, usuarioId, [Rol.PROPIETARIO, Rol.EDITOR]);

  const updateData: any = {};

  if (data.titulo !== undefined) {
    if (!data.titulo || data.titulo.trim().length === 0) {
      throw new Error('El título de la tarea es requerido');
    }
    updateData.titulo = data.titulo.trim();
  }

  if (data.descripcion !== undefined) {
    updateData.descripcion = data.descripcion?.trim();
  }

  if (data.prioridad !== undefined) {
    updateData.prioridad = data.prioridad;
  }

  if (data.completada !== undefined) {
    updateData.completada = data.completada;
    if (data.completada && !tarea.completada) {
      updateData.completadoEn = new Date();
    } else if (!data.completada && tarea.completada) {
      updateData.completadoEn = null;
    }
  }

  const tareaActualizada = await prisma.tarea.update({
    where: { id: tareaId },
    data: updateData,
    include: {
      tablero: {
        select: {
          id: true,
          nombre: true
        }
      }
    }
  });

  return tareaActualizada;
}

export async function eliminarTarea(tareaId: string, usuarioId: number) {
  const tarea = await prisma.tarea.findUnique({
    where: { id: tareaId }
  });

  if (!tarea) {
    throw new Error('Tarea no encontrada');
  }


  await verificarAccesoTablero(tarea.tableroId, usuarioId, [Rol.PROPIETARIO, Rol.EDITOR]);

  await prisma.tarea.delete({
    where: { id: tareaId }
  });

  return { mensaje: 'Tarea eliminada exitosamente' };
}

export async function eliminarTareasCompletadas(tableroId: string, usuarioId: number) {

  await verificarAccesoTablero(tableroId, usuarioId, [Rol.PROPIETARIO, Rol.EDITOR]);

  const resultado = await prisma.tarea.deleteMany({
    where: {
      tableroId,
      completada: true
    }
  });

  return {
    mensaje: `${resultado.count} tareas completadas eliminadas`,
    cantidadEliminada: resultado.count
  };
}

export async function marcarVariasComoCompletadas(tableroId: string, usuarioId: number, tareasIds: string[]) {

  await verificarAccesoTablero(tableroId, usuarioId, [Rol.PROPIETARIO, Rol.EDITOR]);

  if (!tareasIds || tareasIds.length === 0) {
    throw new Error('No se proporcionaron IDs de tareas');
  }

  const resultado = await prisma.tarea.updateMany({
    where: {
      id: { in: tareasIds },
      tableroId
    },
    data: {
      completada: true,
      completadoEn: new Date()
    }
  });

  return {
    mensaje: `${resultado.count} tareas marcadas como completadas`,
    cantidadActualizada: resultado.count
  };
}

export async function obtenerEstadisticasTablero(tableroId: string, usuarioId: number) {

  await verificarAccesoTablero(tableroId, usuarioId);

  const [
    totalTareas,
    tareasCompletadas,
    tareasPendientes,
    tareasPorPrioridad
  ] = await Promise.all([
    prisma.tarea.count({
      where: { tableroId }
    }),
    prisma.tarea.count({
      where: { tableroId, completada: true }
    }),
    prisma.tarea.count({
      where: { tableroId, completada: false }
    }),
    prisma.tarea.groupBy({
      by: ['prioridad'],
      where: { tableroId, completada: false },
      _count: {
        id: true
      }
    })
  ]);

  const estadisticasPrioridad = tareasPorPrioridad.reduce((acc, item) => {
    acc[item.prioridad] = item._count.id;
    return acc;
  }, {} as Record<Prioridad, number>);

  return {
    totalTareas,
    tareasCompletadas,
    tareasPendientes,
    porcentajeCompletado: totalTareas > 0 ? Math.round((tareasCompletadas / totalTareas) * 100) : 0,
    tareasPorPrioridad: {
      [Prioridad.URGENTE]: estadisticasPrioridad[Prioridad.URGENTE] || 0,
      [Prioridad.ALTA]: estadisticasPrioridad[Prioridad.ALTA] || 0,
      [Prioridad.MEDIA]: estadisticasPrioridad[Prioridad.MEDIA] || 0,
      [Prioridad.BAJA]: estadisticasPrioridad[Prioridad.BAJA] || 0
    }
  };
}
