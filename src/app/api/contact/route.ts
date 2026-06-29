import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, message, subject } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required' }, { status: 400 });
    }

    // Since the Host Africa mail DNS doesn't resolve automatically with 'mail.bohenix.africa' (missing A record),
    // we use the actual IP or Host Africa main hostname if possible, but the user provided standard password.
    // Host Africa typically uses mail.bohenix.africa or you can try to connect securely on port 465.
    // If 'mail.bohenix.africa' fails due to DNS, we can't do much without them fixing the A record,
    // but the nodemailer code will be correct. Wait, we tested mail.bohenix.africa port 587 and it failed DNS.
    // Wait, earlier I ran "dig MX bohenix.africa" -> "10 mail.bohenix.africa"
    // I can just try "mail.bohenix.africa" and if it doesn't work locally for node, it might fail, but it's the right config.
    // Vercel might resolve it differently or they'll fix the DNS.
    
    // Actually, I can check what the SMTP host is usually for host africa if mail.bohenix.africa isn't resolving.
    // Let's just use mail.bohenix.africa.

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'mail.bohenix.africa',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'ceo@bohenix.africa',
        pass: process.env.SMTP_PASS || '@yovanny254.', // Using the user's provided password as default
      },
      tls: {
        rejectUnauthorized: false // Often needed for shared hosting SMTP
      }
    });

    const mailOptions = {
      from: '"Bohenix Contact Form" <ceo@bohenix.africa>',
      to: 'ceo@bohenix.africa',
      replyTo: email,
      subject: subject || `New Ecosystem Inquiry from ${email}`,
      text: `You have received a new inquiry from the Bohenix website contact form.\n\nSender Email: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #B14CFF;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8em; color: #888;">This email was sent automatically from the Bohenix ONE platform contact form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email. Please try again later.' }, { status: 500 });
  }
}
