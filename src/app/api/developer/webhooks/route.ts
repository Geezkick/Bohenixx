import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const webhooks = await db.webhook.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ webhooks });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const url = (body?.url || "").trim();
  const description = (body?.description || "").trim() || null;

  if (!url || !/^https?:\/\//.test(url)) {
    return NextResponse.json({ error: "A valid URL is required" }, { status: 400 });
  }

  const existingCount = await db.webhook.count({ where: { userId } });
  if (existingCount >= 5) {
    return NextResponse.json(
      { error: "Maximum of 5 webhooks reached. Delete an existing one first." },
      { status: 400 }
    );
  }

  const secret = `whsec_${crypto.randomBytes(16).toString("hex")}`;

  const webhook = await db.webhook.create({
    data: { userId, url, description, secret },
  });

  await logActivity({
    userId,
    app: "Developer Portal",
    action: `Webhook added for ${new URL(url).hostname}`,
    color: "#00E5FF",
  });

  return NextResponse.json({ webhook });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { id, isActive } = body || {};
  if (!id) {
    return NextResponse.json({ error: "Missing webhook id" }, { status: 400 });
  }

  const webhook = await db.webhook.findUnique({ where: { id } });
  if (!webhook || webhook.userId !== userId) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }

  const updated = await db.webhook.update({
    where: { id },
    data: { isActive: typeof isActive === "boolean" ? isActive : webhook.isActive },
  });

  return NextResponse.json({ webhook: updated });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing webhook id" }, { status: 400 });
  }

  const webhook = await db.webhook.findUnique({ where: { id } });
  if (!webhook || webhook.userId !== userId) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }

  await db.webhook.delete({ where: { id } });

  await logActivity({
    userId,
    app: "Developer Portal",
    action: `Webhook removed for ${new URL(webhook.url).hostname}`,
    color: "#FF3366",
  });

  return NextResponse.json({ success: true });
}
