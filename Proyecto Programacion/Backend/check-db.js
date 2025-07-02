const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

prisma.permission.findMany({
  include: { user: true, board: true },
  orderBy: { id: 'asc' }
}).then(permissions => {
  console.log('=== TODOS LOS PERMISOS EN LA BD ===');
  permissions.forEach(p => {
    console.log(`ID: ${p.id}, User: ${p.user.username} (${p.userId}), Board: ${p.board.name} (${p.boardId}), Level: ${p.level}`);
  });
  return prisma.$disconnect();
}).catch(error => {
  console.error('Error:', error);
  prisma.$disconnect();
});
