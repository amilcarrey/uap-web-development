// Test script to restore permission for testing
const { PrismaClient } = require('@prisma/client');

async function restorePermission() {
    const prisma = new PrismaClient();
    
    try {
        console.log('Restoring Agustin\'s EDITOR permission on board 1...');
        
        await prisma.permission.create({
            data: {
                userId: 2,
                boardId: 1,
                level: 'EDITOR'
            }
        });
        
        console.log('Permission restored successfully!');
        
        // Verify
        const permissions = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Current permissions for board 1:', permissions.map(p => ({ 
            userId: p.userId, 
            username: p.user.username, 
            level: p.level 
        })));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restorePermission();
