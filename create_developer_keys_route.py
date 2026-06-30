import os

path = "src/app/api/developer/keys/route.ts"
os.makedirs(os.path.dirname(path), exist_ok=True)

content = '''import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import crypto from "crypto";
import { db } from "@/lib/db";

function hashKey(rawKey: string) {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

function generateRawKey() {
  const random = crypto.randomBytes(24).toString("hex");
  return `bx_live_${random}`;
}

export async function GET() {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keys = await db.apiKey.findMany({
    where: { userId, revokedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      keyPrefix: true,
      lastUsedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession();
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = (body?.name || "").trim() || "Unnamed Key";

  const existingCount = await db.apiKey.count({
    where: { userId, revokedAt: null },
  });
  if (existingCount >= 10) {
    return NextResponse.json(
      { error: "Maximum of 10 active API keys reached. Revoke an existing key first." },
      { status: 400 }
    );
  }

  const rawKey = generateRawKey();
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 14);

  const created = await db.apiKey.create({
    data: { userId, name, keyHash, keyPrefix },
  });

  return NextResponse.json({
    key: {
      id: created.id,
      name: created.name,
      keyPrefix: created.keyPrefix,
      createdAt: created.createdAt,
    },
    rawKey,
  });
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
    return NextResponse.json({ error: "Missing key id" }, { status: 400 });
  }

  const key = await db.apiKey.findUnique({ where: { id } });
  if (!key || key.userId !== userId) {
    return NextResponse.json({ error: "Key not found" }, { status: 404 });
  }

  await db.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ success: true });
}
'''

with open(path, "w") as f:
    f.write(content)

print(f"Created {path}")
