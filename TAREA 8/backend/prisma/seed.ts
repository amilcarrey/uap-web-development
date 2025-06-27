import { PrismaClient, Prioridad } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('datos de prueba');

  const usuarioAdmin = await prisma.usuario.create({
    data: {
      nombre: 'Usuario Admin',
      email: 'admin@prueba.com',
      contraseña: await bcrypt.hash('123456', 12)
    }
  });

  const usuario1 = await prisma.usuario.create({
    data: {
      nombre: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      contraseña: await bcrypt.hash('123456', 12)
    }
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      nombre: 'María García',
      email: 'maria@ejemplo.com',
      contraseña: await bcrypt.hash('123456', 12)
    }
  });

  const usuario3 = await prisma.usuario.create({
    data: {
      nombre: 'Carlos Rodríguez',
      email: 'carlos@ejemplo.com',
      contraseña: await bcrypt.hash('123456', 12)
    }
  });

  console.log('Usuarios creados');


  const tablero1 = await prisma.tablero.create({
    data: {
      nombre: 'Proyecto Web',
      creadoPorId: usuario1.id
    }
  });

  const tablero2 = await prisma.tablero.create({
    data: {
      nombre: 'Tareas Personales',
      creadoPorId: usuario1.id
    }
  });

  const tablero3 = await prisma.tablero.create({
    data: {
      nombre: 'Equipo de Marketing',
      creadoPorId: usuario2.id
    }
  });

  console.log('Tableros creados');


  await prisma.permiso.create({
    data: {
      usuarioId: usuario2.id,
      tableroId: tablero1.id,
      rol: 'EDITOR'
    }
  });

  await prisma.permiso.create({
    data: {
      usuarioId: usuario3.id,
      tableroId: tablero1.id,
      rol: 'LECTOR'
    }
  });

  await prisma.permiso.create({
    data: {
      usuarioId: usuario1.id,
      tableroId: tablero3.id,
      rol: 'EDITOR'
    }
  });

  console.log('Permisos creados');


  const tareas = [
    {
      titulo: 'Configurar base de datos',
      descripcion: 'Configurar PostgreSQL y las migraciones iniciales',
      prioridad: 'ALTA' as const,
      tableroId: tablero1.id,
      completada: true
    },
    {
      titulo: 'Implementar autenticación',
      descripcion: 'Sistema de login con JWT y cookies HTTP-only',
      prioridad: 'ALTA' as const,
      tableroId: tablero1.id,
      completada: true
    },
    {
      titulo: 'Crear API de tableros',
      descripcion: 'CRUD completo para gestión de tableros',
      prioridad: 'MEDIA' as const,
      tableroId: tablero1.id,
      completada: false
    },
    {
      titulo: 'Implementar autorización',
      descripcion: 'Sistema de roles y permisos granulares',
      prioridad: 'ALTA' as const,
      tableroId: tablero1.id,
      completada: false
    },
    {
      titulo: 'Crear frontend',
      descripcion: 'Interfaz de usuario con React',
      prioridad: 'MEDIA' as const,
      tableroId: tablero1.id,
      completada: false
    },
    {
      titulo: 'Testing y documentación',
      descripcion: 'Pruebas unitarias y documentación de API',
      prioridad: 'BAJA' as const,
      tableroId: tablero1.id,
      completada: false
    },
    {
      titulo: 'Hacer ejercicio',
      descripcion: 'Rutina de ejercicios matutina',
      prioridad: 'MEDIA' as const,
      tableroId: tablero2.id,
      completada: true
    },
    {
      titulo: 'Comprar víveres',
      descripcion: 'Lista de compras para la semana',
      prioridad: 'BAJA' as const,
      tableroId: tablero2.id,
      completada: false
    },
    {
      titulo: 'Llamar al dentista',
      descripcion: 'Agendar cita para revisión',
      prioridad: 'MEDIA' as const,
      tableroId: tablero2.id,
      completada: false
    },
    {
      titulo: 'Campaña redes sociales',
      descripcion: 'Planificar contenido para Instagram y Facebook',
      prioridad: 'ALTA' as const,
      tableroId: tablero3.id,
      completada: false
    },
    {
      titulo: 'Análisis de competencia',
      descripcion: 'Investigar estrategias de la competencia',
      prioridad: 'MEDIA' as const,
      tableroId: tablero3.id,
      completada: false
    },
    {
      titulo: 'Reunión con cliente',
      descripcion: 'Presentar propuesta de campaña Q2',
      prioridad: 'URGENTE' as const,
      tableroId: tablero3.id,
      completada: true
    }
  ];

  for (const tarea of tareas) {
    const { completada, ...tareaData } = tarea;
    await prisma.tarea.create({
      data: {
        ...tareaData,
        completada,
        ...(completada && { completadoEn: new Date() })
      }
    });
  }

  console.log('Tareas creadas');
  console.log('Datos de prueba sembrados exitosamente!');
  
  console.log('\n📋 Resumen de datos creados:');
  console.log(`Usuarios: ${await prisma.usuario.count()}`);
  console.log(`Tableros: ${await prisma.tablero.count()}`);
  console.log(`Tareas: ${await prisma.tarea.count()}`);
  console.log(`Permisos: ${await prisma.permiso.count()}`);
  
  console.log('\n Credenciales de prueba:');
  console.log('Email: juan@ejemplo.com | Contraseña: 123456');
  console.log('Email: maria@ejemplo.com | Contraseña: 123456');
  console.log('Email: carlos@ejemplo.com | Contraseña: 123456');
  console.log('Email: admin@prueba.com | Contraseña: 123456');
}

main()
  .catch((e) => {
    console.error('Error sembrando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
