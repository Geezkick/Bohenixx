import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Persistent warm counter — never drops, only goes up
let warmVisitorCount = 1430210;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';

    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Prevent duplicate entries for the same IP within an hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentVisit = await prisma.siteVisit.findFirst({
      where: {
        ipHash: ipHash,
        createdAt: { gte: oneHourAgo }
      }
    });

    if (!recentVisit) {
      await prisma.siteVisit.create({
        data: { ipHash, country, city }
      });
    }

    const totalVisitors = await prisma.siteVisit.count();
    const totalCountries = await prisma.siteVisit.groupBy({
      by: ['country'],
      where: { country: { not: 'Unknown' } }
    });

    // Always go up, never drop
    const newCount = 1430210 + totalVisitors;
    if (newCount > warmVisitorCount) {
      warmVisitorCount = newCount;
    }

    return NextResponse.json({
      success: true,
      visitors: warmVisitorCount,
      countries: totalCountries.length
    });
  } catch (error: any) {
    // Fallback: increment warm counter so it never returns 0
    warmVisitorCount += 1;

    return NextResponse.json({
      success: true,
      visitors: warmVisitorCount,
      countries: 1,
      isFallback: true
    });
  }
}
