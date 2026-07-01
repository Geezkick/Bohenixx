import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rsvps = await db.eventRsvp.findMany({
    where: { userId },
    select: { eventId: true },
  });

  return NextResponse.json({ eventIds: rsvps.map((r) => r.eventId) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { eventId, eventTitle } = body || {};
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  const existing = await db.eventRsvp.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });
  if (existing) {
    return NextResponse.json({ success: true, alreadyRsvped: true });
  }

  await db.eventRsvp.create({ data: { userId, eventId } });

  await logActivity({
    userId,
    app: "Events",
    action: `RSVP'd to ${eventTitle || eventId}`,
    color: "#B14CFF",
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const eventId = searchParams.get("eventId");
  if (!eventId) {
    return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
  }

  await db.eventRsvp.deleteMany({ where: { userId, eventId } });

  return NextResponse.json({ success: true });
}
