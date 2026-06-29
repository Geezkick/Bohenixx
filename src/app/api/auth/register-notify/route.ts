import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/utils/mailer';
import { getWelcomeEmailTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

/**
 * POST /api/auth/register-notify
 * Fired client-side after a successful Supabase sign-up.
 * Sends a welcome email to the user and an admin alert. Non-blocking.
 */
export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!email) return NextResponse.json({ ok: true });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Only send if user is genuinely authenticated (validates the request)
    if (!user || user.email !== email) {
      return NextResponse.json({ ok: true });
    }

    const displayName = name || user.user_metadata?.full_name || email.split('@')[0] || 'User';

    // Welcome email to new user
    sendEmail({
      to: email,
      from: 'hello@bohenix.africa',
      subject: `Welcome to Bohenix ONE, ${displayName}!`,
      html: getWelcomeEmailTemplate(displayName),
      type: 'SYSTEM',
    }).catch((err) => console.error('Welcome email failed:', err));

    // Admin notification
    sendEmail({
      to: 'bohenixa@bohenix.africa',
      from: 'bohenixa@bohenix.africa',
      subject: `New Account Created: ${displayName} (${email})`,
      html: getInternalAlertTemplate('New User Registration', {
        Name: displayName,
        Email: email,
        Time: new Date().toISOString(),
        'User ID': user.id,
      }),
      type: 'SYSTEM',
    }).catch((err) => console.error('Admin alert failed:', err));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Register notify error:', error);
    return NextResponse.json({ ok: true }); // Always 200 — never block the client
  }
}
