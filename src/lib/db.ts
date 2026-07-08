import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
// Note: If you see TS errors about missing Prisma properties (like 'payment'), 
// it's an IDE cache issue. Restart your TS server or reload the window.
