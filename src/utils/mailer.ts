import nodemailer from 'nodemailer';
import { db } from '@/lib/db';

export interface SendEmailOptions {
  to: string;
  from?: string; // Should be one of the 6 bohenix emails
  subject: string;
  text?: string;
  html: string;
  replyTo?: string;
  type: 'CONTACT' | 'SUPPORT' | 'CAREER' | 'ALERT' | 'SYSTEM';
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.bohenix.africa',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    // We authenticate using the main CEO account, but send FROM the specific department aliases
    user: process.env.SMTP_USER || 'ceo@bohenix.africa',
    pass: process.env.SMTP_PASS || '@yovanny254.', 
  },
  tls: {
    rejectUnauthorized: false
  }
});

/**
 * Sends an email and logs the transaction to the database
 */
export async function sendEmail(options: SendEmailOptions) {
  const fromAddress = options.from || 'hello@bohenix.africa';
  
  // Format the "from" name nicely based on the address
  let fromName = 'Bohenix Solutions';
  if (fromAddress.includes('support')) fromName = 'Bohenix Support';
  else if (fromAddress.includes('career')) fromName = 'Bohenix Careers';
  else if (fromAddress.includes('ceo')) fromName = 'Bohenix Executive';
  else if (fromAddress.includes('bohenixa')) fromName = 'Bohenix System';

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    // Log success
    await db.emailLog.create({
      data: {
        to: options.to,
        from: fromAddress,
        subject: options.subject,
        status: 'SENT',
        type: options.type,
      }
    });

    return { success: true, info };
  } catch (error: any) {
    console.error("Mailer Error:", error);
    
    // Log failure
    await db.emailLog.create({
      data: {
        to: options.to,
        from: fromAddress,
        subject: options.subject,
        status: 'FAILED',
        type: options.type,
        error: error.message || String(error)
      }
    });

    return { success: false, error };
  }
}
