import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Webhook ID required" }, { status: 400 });

    const webhook = await db.webhook.findUnique({
      where: { id, userId },
    });

    if (!webhook) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    // Ping the webhook URL
    const payload = {
      event: "ping",
      created_at: new Date().toISOString(),
      webhook_id: webhook.id,
      message: "Test event from Bohenix Developer Portal",
    };

    let success = false;
    let httpStatus = null;

    try {
      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Bohenix-Signature": "test-signature", // In production, compute HMAC
        },
        body: JSON.stringify(payload),
        // Timeout logic can be complex in Edge/Serverless, using standard fetch
      });
      
      httpStatus = response.status;
      success = response.ok;
    } catch (err: any) {
      console.error("Webhook test delivery failed:", err.message);
    }

    // Update webhook status
    await db.webhook.update({
      where: { id: webhook.id },
      data: {
        lastStatus: success ? "success" : "failed",
        lastSentAt: new Date(),
      },
    });

    await logActivity(userId, "Tested Webhook", webhook.url.substring(0, 30) + "...", "#00E5FF");

    return NextResponse.json({ success, httpStatus });
  } catch (error) {
    console.error("Test Webhook Error:", error);
    return NextResponse.json({ error: "Failed to test webhook" }, { status: 500 });
  }
}
