import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    // Since we don't have a dedicated Waitlist table in Prisma yet, 
    // we can either log this to the console for now, or you can run a Prisma migration later.
    // For now, we simulate a successful database insert.
    console.log(`[WAITLIST SIGNUP] New email joined the waitlist: ${email}`);

    // Return success to the frontend
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process waitlist signup' },
      { status: 500 }
    );
  }
}
