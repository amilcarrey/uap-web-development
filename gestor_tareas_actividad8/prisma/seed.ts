import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crear un usuario de prueba
  const user = await prisma.user.create({
    data: {
      email: 'demo@ejemplo.com',
      password: '1234segura', // ⚠️ En producción esto debe ir hasheado
      name: 'Usuario de prueba',
    },
  });

  // Tableros y tareas
  const boardsWithTasks = [
    {
      name: 'trabajo',
      tasks: ['responder mails', 'completar formularios', 'llamar a cliente'],
    },
    {
      name: 'estudio',
      tasks: ['crear base de datos', 'integrar datos', 'testear'],
    },
    {
      name: 'mascota',
      tasks: ['servir agua', 'limpiar arenero', 'jugar'],
    },
  ];

  for (const boardData of boardsWithTasks) {
    const board = await prisma.board.create({
      data: {
        name: boardData.name,
        ownerId: user.id,
        tasks: {
          create: boardData.tasks.map((text) => ({
            text,
          })),
        },
      },
    });

    console.log(`Tablero creado: ${board.name}`);
  }
}

main()
  .then(() => {
    console.log('Datos de prueba cargados exitosamente.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });
