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

  const entries = await db.labWaitlist.findMany({
    where: { userId },
    select: { labId: true },
  });

  return NextResponse.json({ labIds: entries.map((e) => e.labId) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const userEmail = (session?.user as any)?.email;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { labId, labName } = body || {};
  if (!labId) {
    return NextResponse.json({ error: "Missing labId" }, { status: 400 });
  }

  const existing = await db.labWaitlist.findUnique({
    where: { userId_labId: { userId, labId } },
  });
  if (existing) {
    return NextResponse.json({ success: true, alreadyJoined: true });
  }

  await db.labWaitlist.create({
    data: { userId, labId, email: userEmail || "" },
  });

  await logActivity({
    userId,
    app: "BX Labs",
    action: `Joined waitlist for ${labName || labId}`,
    color: "#B14CFF",
  });

  return NextResponse.json({ success: true });
}
