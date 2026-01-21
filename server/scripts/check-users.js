const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { email: true, name: true, role: true, id: true }
    });

    console.log('--- USER LIST ---');
    if (users.length === 0) {
        console.log('No users found in database.');
    } else {
        console.table(users);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
