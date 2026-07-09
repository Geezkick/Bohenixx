import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { checkSubscription } from '@/lib/subscription';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json({ isActive: false });
    }

    const isActive = await checkSubscription(userId);
    return NextResponse.json({ isActive });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json({ isActive: false });
  }
}
