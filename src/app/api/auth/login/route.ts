import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/utils/mailer';
import { getLoginAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send Login Alert Email (fire-and-forget)
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    const userName = data.user?.user_metadata?.name || email.split('@')[0] || 'User';
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'long' });

    sendEmail({
      to: email,
      from: 'bohenixa@bohenix.africa',
      subject: 'New Sign-In to Your Bohenix Account',
      html: getLoginAlertTemplate(userName, ip, timestamp),
      type: 'SYSTEM'
    }).catch(err => console.error("Login alert email failed:", err));

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

