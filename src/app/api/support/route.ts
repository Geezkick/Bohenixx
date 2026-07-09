import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, message, subject } = body;

    if (!email || !message) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;

    const ticket = await db.supportTicket.create({
      data: {
        ticketNumber,
        email,
        subject: subject || "Support Request",
        message
      }
    });

    // Send auto-reply to user
    await sendEmail({
      to: email,
      subject: `Received: ${ticket.subject} [${ticketNumber}]`,
      text: `Hello,\n\nWe have received your support request. Your ticket number is ${ticketNumber}.\n\nMessage received:\n${message}\n\nOur team will get back to you shortly.\n\nBest,\nBohenix Support`,
      type: 'SUPPORT'
    });

    return NextResponse.json({ success: true, ticketNumber });
  } catch (error) {
    console.error("Support API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
