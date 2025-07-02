// Test para verificar que la funcionalidad de eliminar permisos por ID funciona
const { PrismaClient } = require('@prisma/client');

async function testPermissionDeletionById() {
    const prisma = new PrismaClient();
    
    try {
        console.log('=== Estado inicial de permisos ===');
        const permissionsBefore = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Permisos para board 1:', permissionsBefore.map(p => ({ 
            id: p.id,
            userId: p.userId, 
            username: p.user.username, 
            level: p.level 
        })));
        
        console.log('\n=== Fin del test ===');
        console.log('Para probar la eliminación, ahora puedes usar:');
        console.log('DELETE /api/boards/1/permissions/by-id/{permissionId}');
        console.log('Donde {permissionId} es uno de los IDs mostrados arriba');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPermissionDeletionById();
