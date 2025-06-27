import { prisma } from '../config/prisma';

interface ActualizarConfiguracionData {
  intervaloActualizacion: number;
}

export async function obtenerConfiguracion(usuarioId: number) {
  let configuracion = await prisma.configuracion.findUnique({
    where: { usuarioId }
  });

  if (!configuracion) {
    configuracion = await prisma.configuracion.create({
      data: {
        usuarioId,
        intervaloActualizacion: 30,
        mostrarCompletadas: true,
        ordenarPor: 'creadoEn',
        notificaciones: true
      }
    });
  }

  return configuracion;
}

export async function actualizarConfiguracion(usuarioId: number, data: ActualizarConfiguracionData) {
  if (data.intervaloActualizacion < 5 || data.intervaloActualizacion > 300) {
    throw new Error('El intervalo de actualización debe estar entre 5 y 300 segundos');
  }

  const configuracionExistente = await prisma.configuracion.findUnique({
    where: { usuarioId }
  });

  let configuracion;

  if (configuracionExistente) {
    configuracion = await prisma.configuracion.update({
      where: { usuarioId },
      data: {
        intervaloActualizacion: data.intervaloActualizacion
      }
    });
  } else {
    configuracion = await prisma.configuracion.create({
      data: {
        usuarioId,
        intervaloActualizacion: data.intervaloActualizacion,
        mostrarCompletadas: true,
        ordenarPor: 'creadoEn',
        notificaciones: true
      }
    });
  }

  return configuracion;
}

export async function resetearConfiguracion(usuarioId: number) {
  const configuracionPorDefecto = {
    intervaloActualizacion: 30,
    mostrarCompletadas: true,
    ordenarPor: 'creadoEn',
    notificaciones: true
  };

  const configuracion = await prisma.configuracion.upsert({
    where: { usuarioId },
    update: configuracionPorDefecto,
    create: {
      usuarioId,
      ...configuracionPorDefecto
    }
  });

  return configuracion;
}
