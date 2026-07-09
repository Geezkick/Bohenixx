import nodemailer from 'nodemailer';
import { db } from './db';

// Using standard SMTP. Defaults to logging if no credentials provided.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
  type = 'SYSTEM'
}: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  type?: string;
}) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Bohenix AI" <noreply@bohenix.com>',
      to,
      subject,
      text,
      html,
    };

    if (!process.env.SMTP_USER) {
      console.log('====== MOCK EMAIL DISPATCH ======');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('=================================');
      
      // Save log in DB
      await db.emailLog.create({
        data: {
          to,
          from: mailOptions.from,
          subject,
          status: 'SIMULATED (No SMTP Config)',
          type
        }
      });
      return { success: true, simulated: true };
    }

    const info = await transporter.sendMail(mailOptions);
    
    // Save log in DB
    await db.emailLog.create({
      data: {
        to,
        from: mailOptions.from,
        subject,
        status: 'SENT',
        type
      }
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error);
    
    // Save failed log
    await db.emailLog.create({
      data: {
        to,
        from: process.env.EMAIL_FROM || 'noreply@bohenix.com',
        subject,
        status: 'FAILED',
        type,
        error: String(error)
      }
    });

    return { success: false, error };
  }
};
