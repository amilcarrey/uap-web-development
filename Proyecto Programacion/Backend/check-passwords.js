// Test script to check password hashes
const { PrismaClient } = require('@prisma/client');

async function checkPasswords() {
    const prisma = new PrismaClient();
    
    try {
        const users = await prisma.user.findMany({
            select: { id: true, firstName: true, lastName: true, username: true, password: true }
        });
        
        console.log('Users with password hashes:');
        users.forEach(user => {
            console.log(`${user.username}: ${user.password.substring(0, 30)}...`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkPasswords();
