const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
    console.log('Please provide an email address: node make-admin.js <email>');
    process.exit(1);
}

async function main() {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.log(`User with email ${email} not found.`);
        return;
    }

    const updated = await prisma.user.update({
        where: { email },
        data: { role: 'admin' }
    });

    console.log(`SUCCESS: User ${updated.name} (${updated.email}) is now an ADMIN.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
