import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recent = await prisma.siteVisit.findFirst({
      where: { ipHash, createdAt: { gte: oneHourAgo } }
    });

    if (!recent) {
      await prisma.siteVisit.create({ data: { ipHash, country, city } });
    }

    const totalVisitors = await prisma.siteVisit.count();
    const countriesData = await prisma.siteVisit.findMany({
      where: { country: { not: 'Unknown' } },
      select: { country: true }
    });
    const uniqueCountries = new Set(countriesData.map(d => d.country)).size;

    return NextResponse.json({ success: true, visitors: totalVisitors, countries: uniqueCountries });
  } catch (error) {
    console.error("Analytics visit error:", error);
    return NextResponse.json({ success: false, visitors: 0, countries: 0, isFallback: true });
  }
}
