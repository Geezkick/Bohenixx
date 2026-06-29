import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/utils/mailer';
import { getWelcomeEmailTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Send Welcome Email to new user (fire-and-forget — don't block registration)
    sendEmail({
      to: email,
      from: 'hello@bohenix.africa',
      subject: `Welcome to Bohenix ONE, ${name}!`,
      html: getWelcomeEmailTemplate(name),
      type: 'SYSTEM'
    }).catch(err => console.error("Welcome email failed:", err));

    // Notify admin of new signup
    sendEmail({
      to: 'bohenixa@bohenix.africa',
      from: 'bohenixa@bohenix.africa',
      subject: `New Account Created: ${name} (${email})`,
      html: getInternalAlertTemplate("New User Registration", {
        "Name": name,
        "Email": email,
        "Time": new Date().toISOString()
      }),
      type: 'SYSTEM'
    }).catch(err => console.error("Admin alert failed:", err));

    return NextResponse.json({ user: data.user });
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

