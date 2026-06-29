import { NextResponse } from 'next/server';
import { sendEmail } from '@/utils/mailer';
import { getContactConfirmationTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const { email, message, subject, targetEmail } = await req.json();

    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required' }, { status: 400 });
    }

    // Default to hello@bohenix.africa for general contact
    const allowedTargets = ['ceo@bohenix.africa', 'hello@bohenix.africa', 'info@bohenix.africa'];
    const toAddress = allowedTargets.includes(targetEmail) ? targetEmail : 'hello@bohenix.africa';

    // 1. Send an internal alert to the target mailbox about the new inquiry
    const alertHtml = getInternalAlertTemplate("New Website Contact Inquiry", {
      "Sender Email": email,
      "Target Department": toAddress,
      "Message": message
    });

    await sendEmail({
      to: toAddress,
      from: 'bohenixa@bohenix.africa', // Internal system account
      replyTo: email,
      subject: subject || `New Inquiry from ${email}`,
      html: alertHtml,
      type: 'CONTACT'
    });

    // 2. Send the branded auto-responder back to the user
    const userHtml = getContactConfirmationTemplate("");
    await sendEmail({
      to: email,
      from: toAddress, // Send from the department they contacted
      subject: 'Thank you for contacting Bohenix Solutions',
      html: userHtml,
      type: 'CONTACT'
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (error: any) {
    console.error('Error in contact route:', error);
    return NextResponse.json({ success: false, error: 'Failed to process inquiry. Please try again.' }, { status: 500 });
  }
}

