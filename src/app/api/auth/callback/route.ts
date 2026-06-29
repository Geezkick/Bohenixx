import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/utils/mailer';
import { getLoginAlertTemplate } from '@/utils/emailTemplates';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      // Send login alert for Google sign-in (fire-and-forget)
      const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'Unknown';
      const userName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
      const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'long' });

      sendEmail({
        to: data.user.email!,
        from: 'bohenixa@bohenix.africa',
        subject: 'New Google Sign-In to Your Bohenix Account',
        html: getLoginAlertTemplate(userName, ip, timestamp),
        type: 'SYSTEM'
      }).catch(err => console.error("Google login alert email failed:", err));

      // Redirect to the intended destination
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';

      if (isLocalEnv) {
        // In development, don't use x-forwarded-host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        // In production with a proxy (Vercel), use the forwarded host
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // OAuth failed — redirect with error
  return NextResponse.redirect(`${origin}/?error=auth-callback-failed`);
}
