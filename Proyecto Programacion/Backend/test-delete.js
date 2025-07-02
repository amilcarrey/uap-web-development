const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPermissionDeletion() {
    try {
        console.log('=== 1. Creando permiso de prueba para Agustin ===');
        await prisma.permission.create({
            data: {
                userId: 2, // Agustin
                boardId: 1, // T. Daniel
                level: 'EDITOR'
            }
        });
        console.log('Permiso creado');
        
        console.log('\n=== 2. Verificando que el permiso existe ===');
        const permissionsBefore = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Permisos antes:', permissionsBefore.map(p => ({ 
            id: p.id, userId: p.userId, username: p.user.username, level: p.level 
        })));
        
        console.log('\n=== 3. Eliminando permiso usando deleteMany ===');
        const deleteResult = await prisma.permission.deleteMany({
            where: { boardId: 1, userId: 2 }
        });
        console.log('Resultado deleteMany:', deleteResult);
        
        console.log('\n=== 4. Verificando que el permiso se eliminó ===');
        const permissionsAfter = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        console.log('Permisos después:', permissionsAfter.map(p => ({ 
            id: p.id, userId: p.userId, username: p.user.username, level: p.level 
        })));
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPermissionDeletion();
