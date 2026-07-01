import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { twoFactorEnabled: true, password: true, name: true, email: true },
  });

  let backupCodesRemaining = 0;
  const userWithCodes = await db.user.findUnique({ where: { id: userId }, select: { backupCodes: true } });
  if (userWithCodes?.backupCodes) {
    try {
      backupCodesRemaining = JSON.parse(userWithCodes.backupCodes).length;
    } catch {
      backupCodesRemaining = 0;
    }
  }

  return NextResponse.json({
    twoFactorEnabled: user?.twoFactorEnabled || false,
    hasPassword: !!user?.password,
    name: user?.name,
    email: user?.email,
    backupCodesRemaining,
  });
}
