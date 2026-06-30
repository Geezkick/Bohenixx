import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) return NextResponse.json({ user: null });
    return NextResponse.json({ user: session.user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
