import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid email is required' }, { status: 400 });
    }

    // Log to console (in absence of Waitlist table)
    console.log(`[WAITLIST SIGNUP] New email joined the waitlist: ${email}`);

    // Send confirmation email to the user
    await sendEmail({
      to: email,
      subject: 'Welcome to the Bohenix Global Launch Waitlist',
      text: `Hello,\n\nYou have successfully joined the Bohenix Global Launch Waitlist.\n\nWe will notify you on November 23rd, 2026, the moment our infrastructure opens up to the public.\n\nBest,\nBrian Nyarienya\nFounder, Bohenix Technologies`,
      type: 'WAITLIST_CONFIRMATION'
    });

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
