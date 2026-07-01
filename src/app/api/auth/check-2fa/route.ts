import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ requiresTwoFactor: false });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { twoFactorEnabled: true },
    });

    return NextResponse.json({ requiresTwoFactor: !!user?.twoFactorEnabled });
  } catch (error) {
    console.error('check-2fa Error:', error);
    return NextResponse.json({ requiresTwoFactor: false });
  }
}
