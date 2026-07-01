import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { sendEmail } from '@/utils/mailer';
import { getLoginAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: true });

    const session = await getServerSession(authOptions);

    if (!session?.user?.email || session.user.email !== email) {
      return NextResponse.json({ ok: true });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'Unknown';
    const userName = session.user.name || email.split('@')[0] || 'User';
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
    return NextResponse.json({ ok: true });
  }
}
