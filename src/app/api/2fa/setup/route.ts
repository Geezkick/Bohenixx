import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { db } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  const userEmail = (session?.user as any)?.email;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (user?.twoFactorEnabled) {
    return NextResponse.json({ error: "Two-factor authentication is already enabled" }, { status: 400 });
  }

  const secret = authenticator.generateSecret();
  const otpauthUrl = authenticator.keyuri(userEmail || "user", "Bohenix ONE", secret);
  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

  // Store the pending secret (not yet enabled until verified)
  await db.user.update({
    where: { id: userId },
    data: { twoFactorSecret: secret },
  });

  return NextResponse.json({ qrCodeDataUrl, secret });
}
