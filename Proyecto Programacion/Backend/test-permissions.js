// Test script to check current permissions in the database
const { PrismaClient } = require('@prisma/client');

async function checkPermissions() {
    const prisma = new PrismaClient();
    
    try {
        console.log('=== USUARIOS ===');
        const users = await prisma.user.findMany({
            select: { id: true, firstName: true, lastName: true, username: true }
        });
        console.log(users);
        
        console.log('\n=== TABLEROS ===');
        const boards = await prisma.board.findMany({
            select: { id: true, name: true, ownerId: true }
        });
        console.log(boards);
        
        console.log('\n=== PERMISOS ===');
        const permissions = await prisma.permission.findMany({
            include: {
                user: { select: { id: true, firstName: true, lastName: true } },
                board: { select: { id: true, name: true } }
            }
        });
        console.log(permissions.map(p => ({
            userId: p.userId,
            userName: `${p.user.firstName} ${p.user.lastName}`,
            boardId: p.boardId,
            boardName: p.board.name,
            level: p.level
        })));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPermissions();
