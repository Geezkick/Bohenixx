import os

path = "src/app/api/services/request/route.ts"

content = '''import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { sendEmail } from "@/utils/mailer";
import { getContactConfirmationTemplate, getInternalAlertTemplate } from "@/utils/emailTemplates";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await db.serviceRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ requests });
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const userId = (session?.user as any)?.id || null;

    const { service, budget, timeline, details, email } = await req.json();

    const request = await db.serviceRequest.create({
      data: { service, budget, timeline, details, email, userId },
    });

    if (userId) {
      await logActivity({
        userId,
        app: "Services",
        action: `Requested ${service}`,
        color: "#B14CFF",
      });
    }

    sendEmail({
      to: "info@bohenix.africa",
      from: "bohenixa@bohenix.africa",
      replyTo: email,
      subject: `New Service Request: ${service}`,
      html: getInternalAlertTemplate("New Service Request Submitted", {
        Service: service,
        Budget: budget,
        Timeline: timeline,
        Email: email,
        Details: details,
      }),
      type: "CONTACT",
    }).catch((err) => console.error("Service request alert failed:", err));

    sendEmail({
      to: email,
      from: "info@bohenix.africa",
      subject: "Service Request Received - Bohenix Solutions",
      html: getContactConfirmationTemplate(""),
      type: "CONTACT",
    }).catch((err) => console.error("Service confirmation failed:", err));

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
'''

with open(path, "w") as f:
    f.write(content)

print(f"Updated {path}")
