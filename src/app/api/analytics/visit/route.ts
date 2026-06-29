import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Track actual DB counts

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

    return NextResponse.json({
      success: true,
      visitors: totalVisitors,
      countries: totalCountries.length
    });
  } catch (error: any) {
    // Fallback in case of DB error
    return NextResponse.json({
      success: false,
      visitors: 0,
      countries: 0,
      isFallback: true
    });
  }
}
