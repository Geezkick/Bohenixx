import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalVisitors = await prisma.siteVisit.count();
    const totalUsers = await prisma.user.count();
    const countriesData = await prisma.siteVisit.findMany({
      where: { country: { not: 'Unknown' } },
      select: { country: true }
    });
    const uniqueCountries = new Set(countriesData.map(d => d.country)).size;
    return NextResponse.json({ success: true, visitors: totalVisitors, users: totalUsers, countries: uniqueCountries });
  } catch (error) {
    console.error("Analytics count error:", error);
    return NextResponse.json({ success: false, visitors: 0, users: 0, countries: 0, isFallback: true });
  }
}
