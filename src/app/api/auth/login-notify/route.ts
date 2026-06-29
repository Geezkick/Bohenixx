import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/utils/mailer';
import { getLoginAlertTemplate } from '@/utils/emailTemplates';

/**
 * POST /api/auth/login-notify
 * Fired client-side after a successful Supabase sign-in.
 * Sends a login security alert email. Non-blocking — called fire-and-forget.
 */
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: true });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Only send if user is genuinely authenticated (validates the request)
    if (!user || user.email !== email) {
      return NextResponse.json({ ok: true });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    const userName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split('@')[0] ||
      'User';
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'Africa/Nairobi',
      dateStyle: 'full',
      timeStyle: 'long',
    });

    sendEmail({
      to: email,
      from: 'bohenixa@bohenix.africa',
      subject: 'New Sign-In to Your Bohenix Account',
      html: getLoginAlertTemplate(userName, ip, timestamp),
      type: 'SYSTEM',
    }).catch((err) => console.error('Login alert email failed:', err));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Login notify error:', error);
    return NextResponse.json({ ok: true }); // Always 200 — never block the client
  }
}
