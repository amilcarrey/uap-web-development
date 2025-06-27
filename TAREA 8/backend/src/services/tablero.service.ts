import { prisma } from '../config/prisma';
import { Rol } from '@prisma/client';

interface CrearTableroData {
  nombre: string;
  descripcion?: string;
}

interface CompartirTableroData {
  tableroId: string;
  emailUsuario: string;
  rol: Rol;
}

export async function crearTablero(usuarioId: number, data: CrearTableroData) {
  const { nombre, descripcion } = data;

  if (!nombre || nombre.trim().length === 0) {
    throw new Error('El nombre del tablero es requerido');
  }

  const tablero = await prisma.tablero.create({
    data: {
      nombre: nombre.trim(),
      ...(descripcion && { descripcion: descripcion.trim() }),
      creadoPorId: usuarioId
    },
    include: {
      creadoPor: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      permisos: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      _count: {
        select: {
          tareas: true
        }
      }
    }
  });

  return tablero;
}

export async function obtenerTablerosUsuario(usuarioId: number) {
  const tableros = await prisma.tablero.findMany({
    where: {
      OR: [
        { creadoPorId: usuarioId },
        { 
          permisos: {
            some: {
              usuarioId: usuarioId
            }
          }
        }
      ]
    },
    include: {
      creadoPor: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      permisos: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      _count: {
        select: {
          tareas: true
        }
      }
    },
    orderBy: {
      creadoEn: 'desc'
    }
  });


  return tableros.map(tablero => {
    let rolUsuario: Rol = Rol.LECTOR;
    
    if (tablero.creadoPorId === usuarioId) {
      rolUsuario = Rol.PROPIETARIO;
    } else {
      const permiso = tablero.permisos.find(p => p.usuarioId === usuarioId);
      if (permiso) {
        rolUsuario = permiso.rol;
      }
    }

    return {
      ...tablero,
      rolUsuario
    };
  });
}

export async function obtenerTablero(tableroId: string, usuarioId: number) {
  const tablero = await prisma.tablero.findUnique({
    where: { id: tableroId },
    include: {
      creadoPor: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      permisos: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      tareas: {
        orderBy: {
          creadoEn: 'desc'
        }
      }
    }
  });

  if (!tablero) {
    throw new Error('Tablero no encontrado');
  }

  const tieneAcceso = tablero.creadoPorId === usuarioId || 
                     tablero.permisos.some(p => p.usuarioId === usuarioId);

  if (!tieneAcceso) {
    throw new Error('No tienes acceso a este tablero');
  }


  let rolUsuario: Rol = Rol.LECTOR;
  if (tablero.creadoPorId === usuarioId) {
    rolUsuario = Rol.PROPIETARIO;
  } else {
    const permiso = tablero.permisos.find(p => p.usuarioId === usuarioId);
    if (permiso) {
      rolUsuario = permiso.rol;
    }
  }

  return {
    ...tablero,
    rolUsuario
  };
}

export async function actualizarTablero(tableroId: string, usuarioId: number, data: Partial<CrearTableroData>) {

  const tablero = await prisma.tablero.findUnique({
    where: { id: tableroId }
  });

  if (!tablero) {
    throw new Error('Tablero no encontrado');
  }

  if (tablero.creadoPorId !== usuarioId) {
    throw new Error('Solo el propietario puede editar el tablero');
  }

  const tableroActualizado = await prisma.tablero.update({
    where: { id: tableroId },
    data: {
      ...(data.nombre && { nombre: data.nombre.trim() }),
      ...(data.descripcion !== undefined && { descripcion: data.descripcion?.trim() })
    },
    include: {
      creadoPor: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      permisos: {
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true
            }
          }
        }
      },
      _count: {
        select: {
          tareas: true
        }
      }
    }
  });

  return tableroActualizado;
}

export async function eliminarTablero(tableroId: string, usuarioId: number) {

  const tablero = await prisma.tablero.findUnique({
    where: { id: tableroId }
  });

  if (!tablero) {
    throw new Error('Tablero no encontrado');
  }

  if (tablero.creadoPorId !== usuarioId) {
    throw new Error('Solo el propietario puede eliminar el tablero');
  }

  await prisma.tablero.delete({
    where: { id: tableroId }
  });

  return { mensaje: 'Tablero eliminado exitosamente' };
}

export async function compartirTablero(usuarioId: number, data: CompartirTableroData) {
  const { tableroId, emailUsuario, rol } = data;

  // Normalizar email
  const emailNormalizado = emailUsuario.toLowerCase().trim();


  const tablero = await prisma.tablero.findUnique({
    where: { id: tableroId }
  });

  if (!tablero) {
    throw new Error('Tablero no encontrado');
  }

  if (tablero.creadoPorId !== usuarioId) {
    throw new Error('Solo el propietario puede compartir el tablero');
  }


  const usuarioACompartir = await prisma.usuario.findUnique({
    where: { email: emailNormalizado }
  });

  if (!usuarioACompartir) {
    throw new Error('El email proporcionado no está registrado');
  }


  if (usuarioACompartir.id === usuarioId) {
    throw new Error('No puedes compartir el tablero contigo mismo');
  }


  const permisoExistente = await prisma.permiso.findFirst({
    where: {
      usuarioId: usuarioACompartir.id,
      tableroId: tableroId
    }
  });

  if (permisoExistente) {

    const permisoActualizado = await prisma.permiso.update({
      where: {
        id: permisoExistente.id
      },
      data: { rol },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });

    return permisoActualizado;
  } else {

    const nuevoPermiso = await prisma.permiso.create({
      data: {
        usuarioId: usuarioACompartir.id,
        tableroId: tableroId,
        rol: rol
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        }
      }
    });

    return nuevoPermiso;
  }
}

export async function eliminarPermiso(usuarioId: number, tableroId: string, usuarioPermisoId: number) {

  const tablero = await prisma.tablero.findUnique({
    where: { id: tableroId }
  });

  if (!tablero) {
    throw new Error('Tablero no encontrado');
  }

  if (tablero.creadoPorId !== usuarioId) {
    throw new Error('Solo el propietario puede eliminar permisos');
  }


  const permiso = await prisma.permiso.findFirst({
    where: {
      usuarioId: usuarioPermisoId,
      tableroId: tableroId
    }
  });

  if (!permiso) {
    throw new Error('Permiso no encontrado');
  }

  await prisma.permiso.delete({
    where: {
      id: permiso.id
    }
  });

  return { mensaje: 'Permiso eliminado exitosamente' };
}
