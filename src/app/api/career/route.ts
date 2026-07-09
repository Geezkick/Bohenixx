import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, position, portfolioUrl, coverLetter } = body;

    if (!email || !name || !position) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const application = await db.jobApplication.create({
      data: {
        email,
        name,
        position,
        portfolioUrl: portfolioUrl || null,
        coverLetter: coverLetter || null
      }
    });

    // Send auto-reply to applicant
    await sendEmail({
      to: email,
      subject: `Application Received: ${position}`,
      text: `Hello ${name},\n\nThank you for applying to Bohenix Technologies for the ${position} position.\n\nWe have received your application and our recruitment team will review it shortly. If your profile matches our requirements, we will reach out to you to schedule an interview.\n\nBest,\nBohenix Careers`,
      type: 'CAREERS'
    });

    return NextResponse.json({ success: true, applicationId: application.id });
  } catch (error) {
    console.error("Career API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
