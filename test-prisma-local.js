const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  try {
    const count = await prisma.user.count();
    console.log("Local Users count:", count);
  } catch (err) {
    console.error("Local Prisma error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
