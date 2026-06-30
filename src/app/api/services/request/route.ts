import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '@/utils/mailer';
import { getContactConfirmationTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { service, budget, timeline, details, email } = await req.json();

    const request = await prisma.serviceRequest.create({
      data: { service, budget, timeline, details, email }
    });

    sendEmail({
      to: 'info@bohenix.africa',
      from: 'bohenixa@bohenix.africa',
      replyTo: email,
      subject: `New Service Request: ${service}`,
      html: getInternalAlertTemplate("New Service Request Submitted", {
        "Service": service, "Budget": budget, "Timeline": timeline, "Email": email, "Details": details
      }),
      type: 'CONTACT'
    }).catch(err => console.error("Service request alert failed:", err));

    sendEmail({
      to: email,
      from: 'info@bohenix.africa',
      subject: 'Service Request Received - Bohenix Solutions',
      html: getContactConfirmationTemplate(""),
      type: 'CONTACT'
    }).catch(err => console.error("Service confirmation failed:", err));

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
