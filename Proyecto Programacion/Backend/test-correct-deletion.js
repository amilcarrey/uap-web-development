// Test deletion with correct user ID
const { PrismaClient } = require('@prisma/client');

async function testCorrectDeletion() {
    const prisma = new PrismaClient();
    
    try {
        console.log('=== BEFORE DELETION (Agustin userId: 2) ===');
        let board1Permissions = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Permissions:', board1Permissions.map(p => ({ 
            id: p.id, userId: p.userId, username: p.user.username, level: p.level 
        })));
        
        console.log('\n=== DELETING Agustin permission (userId: 2) ===');
        const deleteResult = await prisma.permission.deleteMany({
            where: { userId: 2, boardId: 1 }
        });
        console.log('Delete result:', deleteResult);
        
        console.log('\n=== AFTER DELETION ===');
        board1Permissions = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Permissions:', board1Permissions.map(p => ({ 
            id: p.id, userId: p.userId, username: p.user.username, level: p.level 
        })));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testCorrectDeletion();
