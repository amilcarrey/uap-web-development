// Restore Agustin's permission
const { PrismaClient } = require('@prisma/client');

async function restore() {
    const prisma = new PrismaClient();
    
    try {
        await prisma.permission.create({
            data: { userId: 2, boardId: 1, level: 'EDITOR' }
        });
        console.log('Agustin\'s permission restored');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

restore();
