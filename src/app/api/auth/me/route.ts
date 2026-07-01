import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: session.user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
