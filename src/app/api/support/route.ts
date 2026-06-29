import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/utils/mailer';
import { getSupportTicketTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const { email, message, subject } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required' }, { status: 400 });
    }

    // Generate a unique ticket number
    const ticketNumber = `BX-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Support Ticket in DB
    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        email,
        subject: subject || 'Support Request',
        message
      }
    });

    // 1. Send Internal Alert to support@bohenix.africa
    const alertHtml = getInternalAlertTemplate(`New Support Ticket Created (#${ticketNumber})`, {
      "Sender Email": email,
      "Subject": ticket.subject,
      "Message": message
    });

    await sendEmail({
      to: 'support@bohenix.africa',
      from: 'bohenixa@bohenix.africa',
      replyTo: email,
      subject: `New Ticket #${ticketNumber}: ${ticket.subject}`,
      html: alertHtml,
      type: 'SUPPORT'
    });

    // 2. Send Ticket Confirmation to User
    const userHtml = getSupportTicketTemplate(ticketNumber, message);
    await sendEmail({
      to: email,
      from: 'support@bohenix.africa',
      subject: `[Ticket #${ticketNumber}] Support Request Received`,
      html: userHtml,
      type: 'SUPPORT'
    });

    return NextResponse.json({ success: true, message: 'Ticket created successfully', ticketNumber });
  } catch (error: any) {
    console.error('Error in support route:', error);
    return NextResponse.json({ success: false, error: 'Failed to create support ticket. Please try again.' }, { status: 500 });
  }
}
