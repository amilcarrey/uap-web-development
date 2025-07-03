import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpiar base de datos
  await prisma.task.deleteMany();
  await prisma.sharedBoard.deleteMany();
  await prisma.board.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios con contraseñas hasheadas
  const alicia = await prisma.user.create({
    data: {
      name: 'Alicia',
      email: 'alicia@example.com',
      password: await bcrypt.hash('claveAlicia123', 10)
    }
  });

  const brenda = await prisma.user.create({
    data: {
      name: 'Brenda',
      email: 'brenda@example.com',
      password: await bcrypt.hash('claveBrenda123', 10)
    }
  });

  const carlos = await prisma.user.create({
    data: {
      name: 'Carlos',
      email: 'carlos@example.com',
      password: await bcrypt.hash('claveCarlos123', 10)
    }
  });

  // Configuración de usuarios
  for (const user of [alicia, brenda, carlos]) {
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        refetchInterval: 10000,
        uppercaseDescriptions: false
      }
    });
  }

  // Crear tableros con tareas
  const limpieza = await prisma.board.create({
    data: {
      name: 'Limpieza',
      ownerId: alicia.id,
      tasks: {
        create: [
          { text: 'Barrer' },
          { text: 'Fregar' },
          { text: 'Sacar la basura' },
          { text: 'Organizar estantes' }
        ]
      }
    }
  });

  const trabajo = await prisma.board.create({
    data: {
      name: 'Trabajo',
      ownerId: alicia.id,
      tasks: {
        create: [
          { text: 'Responder mail' },
          { text: 'Entrevista presencial con cliente' },
          { text: 'Enviar mail' },
          { text: 'Reunión de equipo' },
          { text: 'Llamar a posible cliente' },
          { text: 'Ordenar notas' },
          { text: 'Entregar informe' },
          { text: 'Actualizar planillas' },
          { text: 'Revisar propuestas' },
          { text: 'Enviar presupuesto' },
          { text: 'Programar cita' }
        ]
      }
    }
  });

  const estudio = await prisma.board.create({
    data: {
      name: 'Estudio',
      ownerId: brenda.id,
      tasks: {
        create: [
          { text: 'Leer capítulo 3' },
          { text: 'Preparar presentación' },
          { text: 'Revisar apuntes' }
        ]
      }
    }
  });

  // Compartir tableros
  await prisma.sharedBoard.createMany({
    data: [
      {
        userId: brenda.id,
        boardId: trabajo.id,
        role: 'EDITOR'
      },
      {
        userId: carlos.id,
        boardId: limpieza.id,
        role: 'VIEWER'
      }
    ]
  });

  console.log('Usuarios, tableros y tareas creados exitosamente.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
