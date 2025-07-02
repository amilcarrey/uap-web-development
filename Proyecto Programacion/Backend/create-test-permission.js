const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestPermission() {
    try {
        console.log('=== Creando permiso de prueba para Agustin ===');
        await prisma.permission.create({
            data: {
                userId: 2, // Agustin
                boardId: 1, // T. Daniel
                level: 'EDITOR'
            }
        });
        console.log('Permiso creado exitosamente');
        
        console.log('\n=== Estado actual de permisos ===');
        const permissions = await prisma.permission.findMany({
            where: { boardId: 1 },
            include: { user: true }
        });
        permissions.forEach(p => {
            console.log(`ID: ${p.id}, User: ${p.user.username} (${p.userId}), Level: ${p.level}`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createTestPermission();
