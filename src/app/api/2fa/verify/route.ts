import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authenticator } from "otplib";
import crypto from "crypto";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

function generateBackupCodes(count = 10) {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(crypto.randomBytes(5).toString("hex"));
  }
  return codes;
}

function hashCode(code: string) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { code } = body || {};
  if (!code) {
    return NextResponse.json({ error: "Missing verification code" }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "No pending 2FA setup found. Start setup again." }, { status: 400 });
  }

  const isValid = authenticator.verify({ token: code, secret: user.twoFactorSecret });
  if (!isValid) {
    return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
  }

  const backupCodes = generateBackupCodes();
  const hashedCodes = backupCodes.map(hashCode);

  await db.user.update({
    where: { id: userId },
    data: {
      twoFactorEnabled: true,
      backupCodes: JSON.stringify(hashedCodes),
    },
  });

  await logActivity({
    userId,
    app: "Account Security",
    action: "Two-factor authentication enabled",
    color: "#22c55e",
  });

  return NextResponse.json({ success: true, backupCodes });
}
