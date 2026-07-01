import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { sendEmail } from "@/utils/mailer";
import { getContactConfirmationTemplate, getInternalAlertTemplate } from "@/utils/emailTemplates";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  const session = await getServerSession(authOptions);
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
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    const { service, budget, timeline, details, email } = await req.json();

    const getTargetEmail = (svc: string) => {
      const supportServices = ["Cybersecurity Audit", "IT Consulting", "Cloud Infrastructure"];
      const helloServices = [
        "AI & Machine Learning", 
        "Web Application Development", 
        "Mobile App Development", 
        "Enterprise Software (ERP/CRM)", 
        "Data Analytics & BI", 
        "UI/UX Design"
      ];
      
      if (supportServices.includes(svc)) return "support@bohenix.africa";
      if (helloServices.includes(svc)) return "hello@bohenix.africa";
      return "info@bohenix.africa";
    };

    const targetEmail = getTargetEmail(service);

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
      to: targetEmail,
      from: targetEmail,
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
      from: targetEmail,
      subject: "Service Request Received - Bohenix Solutions",
      html: getContactConfirmationTemplate(""),
      type: "CONTACT",
    }).catch((err) => console.error("Service confirmation failed:", err));

    return NextResponse.json({ success: true, request });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
