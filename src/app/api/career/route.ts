import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/utils/mailer';
import { getJobApplicationTemplate, getInternalAlertTemplate } from '@/utils/emailTemplates';

export async function POST(req: Request) {
  try {
    const { email, name, position, portfolioUrl, coverLetter } = await req.json();

    if (!email || !name || !position) {
      return NextResponse.json({ success: false, error: 'Email, name, and position are required' }, { status: 400 });
    }

    // Create Job Application in DB
    const application = await db.jobApplication.create({
      data: {
        email,
        name,
        position,
        portfolioUrl: portfolioUrl || null,
        coverLetter: coverLetter || null
      }
    });

    // 1. Send Internal Alert to career@bohenix.africa
    const alertHtml = getInternalAlertTemplate(`New Job Application Received: ${position}`, {
      "Applicant Name": name,
      "Applicant Email": email,
      "Position": position,
      "Portfolio/LinkedIn": portfolioUrl || 'Not provided',
      "Cover Letter": coverLetter || 'Not provided'
    });

    await sendEmail({
      to: 'career@bohenix.africa',
      from: 'career@bohenix.africa',
      replyTo: email,
      subject: `New Application: ${name} for ${position}`,
      html: alertHtml,
      type: 'CAREER'
    });

    // 2. Send Application Confirmation to User
    const userHtml = getJobApplicationTemplate(position);
    await sendEmail({
      to: email,
      from: 'career@bohenix.africa',
      subject: `Application Received: ${position} at Bohenix`,
      html: userHtml,
      type: 'CAREER'
    });

    return NextResponse.json({ success: true, message: 'Application submitted successfully' });
  } catch (error: any) {
    console.error('Error in career route:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit application. Please try again.' }, { status: 500 });
  }
}
