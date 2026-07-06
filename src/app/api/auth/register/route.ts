import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { sendEmail } from '@/utils/mailer';
import { getWelcomeEmailTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { name, email, password } = body;

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Please provide a valid name, email, and password (min 6 characters)' }, { status: 400 });
    }

    let existing;
    try {
      existing = await db.user.findUnique({ where: { email } });
    } catch (dbErr: any) {
      console.error('Database connection error during registration:', dbErr);
      return NextResponse.json({ error: 'Service temporarily unavailable. Please try again.' }, { status: 503 });
    }

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    try {
      user = await db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
    } catch (dbErr: any) {
      console.error('Database error creating user:', dbErr);
      return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 503 });
    }

    sendEmail({
      to: email,
      from: 'hello@bohenix.africa',
      subject: `Welcome to Bohenix ONE, ${name}!`,
      html: getWelcomeEmailTemplate(name),
      type: 'SYSTEM',
    }).catch((err) => console.error('Welcome email failed:', err));

    sendEmail({
      to: 'hello@bohenix.africa',
      from: 'hello@bohenix.africa',
      subject: `New Account Created: ${name} (${email})`,
      html: getInternalAlertTemplate('New User Registration', {
        Name: name,
        Email: email,
        Time: new Date().toISOString(),
        'User ID': user.id,
      }),
      type: 'SYSTEM',
    }).catch((err) => console.error('Admin alert failed:', err));

    return NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

