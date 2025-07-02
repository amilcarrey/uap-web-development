// Test script to manually test permission deletion
const { PrismaClient } = require('@prisma/client');

async function testPermissionDeletion() {
    const prisma = new PrismaClient();
    
    try {
        console.log('=== BEFORE DELETION ===');
        const permissionsBefore = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Permissions for board 1:', permissionsBefore.map(p => ({ 
            id: p.id,
            userId: p.userId, 
            username: p.user.username, 
            level: p.level 
        })));
        
        // Try to delete Agustin's permission (userId: 2, boardId: 1)
        console.log('\n=== DELETING Agustin permission ===');
        console.log('Attempting to delete permission for userId: 2, boardId: 1');
        
        const deleteResult = await prisma.permission.deleteMany({
            where: { userId: 2, boardId: 1 }
        });
        console.log('Delete result:', deleteResult);
        
        console.log('\n=== AFTER DELETION ===');
        const permissionsAfter = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Permissions for board 1:', permissionsAfter.map(p => ({ 
            id: p.id,
            userId: p.userId, 
            username: p.user.username, 
            level: p.level 
        })));
        
        // Verify specific permission is gone
        const specificPermission = await prisma.permission.findUnique({
            where: { userId_boardId: { userId: 2, boardId: 1 } }
        });
        console.log('\nSpecific permission check (should be null):', specificPermission);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPermissionDeletion();
