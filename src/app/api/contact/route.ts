import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, message, targetEmail, subject } = body;

    if (!email || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Send the inquiry to the appropriate internal inbox (simulated via our email service)
    await sendEmail({
      to: targetEmail || 'hello@bohenix.africa',
      subject: subject || `New Website Inquiry from ${email}`,
      text: `Inquiry from: ${email}\n\nMessage:\n${message}`,
      type: 'INQUIRY_INTERNAL'
    });

    // Send auto-reply to the user
    await sendEmail({
      to: email,
      subject: `Re: ${subject || 'Your Inquiry to Bohenix'}`,
      text: `Hello,\n\nWe have received your message and our team will get back to you shortly.\n\nBest,\nBohenix Team`,
      type: 'INQUIRY_REPLY'
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
