import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = (body?.name || "").trim();

  if (!name) {
    return NextResponse.json({ error: "Name cannot be empty" }, { status: 400 });
  }

  await db.user.update({ where: { id: userId }, data: { name } });

  await logActivity({
    userId,
    app: "Account",
    action: "Profile updated",
    color: "#00E5FF",
  });

  return NextResponse.json({ success: true });
}
