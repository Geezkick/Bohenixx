const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const userId = "doesnotexist";
  const last24Hours = new Date();
  last24Hours.setHours(last24Hours.getHours() - 24);

  const recentReversals = await prisma.mpesaTransaction.count({
    where: {
      userId,
      status: "FAILED",
      createdAt: { gte: last24Hours }
    }
  });
  console.log("Reversals", recentReversals);
}
run().catch(console.error).finally(() => prisma.$disconnect());
