import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { sendEmail } from '@/utils/mailer';
import { getLoginAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'Unknown';
    const userName = user.name || email.split('@')[0];
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi', dateStyle: 'full', timeStyle: 'long' });

    sendEmail({
      to: email,
      from: 'hello@bohenix.africa',
      subject: 'New Sign-In to Your Bohenix Account',
      html: getLoginAlertTemplate(userName, ip, timestamp),
      type: 'SYSTEM'
    }).catch(err => console.error("Login alert email failed:", err));

    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
