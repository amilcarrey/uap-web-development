// Check current permissions state
const { PrismaClient } = require('@prisma/client');

async function checkCurrentState() {
    const prisma = new PrismaClient();
    
    try {
        console.log('=== ALL PERMISSIONS IN DATABASE ===');
        const allPermissions = await prisma.permission.findMany({
            include: { user: true, board: true },
            orderBy: { id: 'asc' }
        });
        
        allPermissions.forEach(p => {
            console.log(`ID: ${p.id}, User: ${p.user.username} (${p.userId}), Board: ${p.board.name} (${p.boardId}), Level: ${p.level}`);
        });
        
        console.log('\n=== PERMISSIONS FOR BOARD 1 ===');
        const board1Permissions = allPermissions.filter(p => p.boardId === 1);
        board1Permissions.forEach(p => {
            console.log(`ID: ${p.id}, User: ${p.user.username} (${p.userId}), Level: ${p.level}`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkCurrentState();
