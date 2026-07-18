const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const agents = await prisma.flowAgent.findMany({
    where: { userId: 'doesnotexist' },
    include: { tasks: { select: { status: true } } }
  });
  console.log("Success", agents);
}
run().catch(console.error).finally(() => prisma.$disconnect());
