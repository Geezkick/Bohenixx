import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/utils/mailer';
import { getContactConfirmationTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const body = await req.json();
    const { service, budget, timeline, details, email } = body;

    // Map Service Request to Contacts table structure
    const name = `Service Request: ${service}`;
    const message = `Budget: ${budget}\nTimeline: ${timeline}\nDetails: ${details}`;

    const { data, error } = await supabase
      .from('contacts')
      .insert([
        { name, email, message }
      ])
      .select();

    if (error) {
      throw error;
    }

    // Send internal notification to info@ about the service request
    sendEmail({
      to: 'info@bohenix.africa',
      from: 'bohenixa@bohenix.africa',
      replyTo: email,
      subject: `New Service Request: ${service}`,
      html: getInternalAlertTemplate("New Service Request Submitted", {
        "Service": service,
        "Budget": budget,
        "Timeline": timeline,
        "Email": email,
        "Details": details
      }),
      type: 'CONTACT'
    }).catch(err => console.error("Service request alert failed:", err));

    // Send auto-responder to the customer
    sendEmail({
      to: email,
      from: 'info@bohenix.africa',
      subject: 'Service Request Received - Bohenix Solutions',
      html: getContactConfirmationTemplate(""),
      type: 'CONTACT'
    }).catch(err => console.error("Service confirmation failed:", err));

    return NextResponse.json({ success: true, request: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

