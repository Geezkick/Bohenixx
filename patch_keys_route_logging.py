path = "src/app/api/developer/keys/route.ts"
with open(path, "r") as f:
    content = f.read()

content = content.replace(
    'import { db } from "@/lib/db";',
    'import { db } from "@/lib/db";\nimport { logActivity } from "@/lib/activityLogger";'
)

content = content.replace(
    '''  const created = await db.apiKey.create({
    data: { userId, name, keyHash, keyPrefix },
  });

  return NextResponse.json({''',
    '''  const created = await db.apiKey.create({
    data: { userId, name, keyHash, keyPrefix },
  });

  await logActivity({
    userId,
    app: "Developer Portal",
    action: `API key "${name}" created`,
    color: "#B14CFF",
  });

  return NextResponse.json({'''
)

content = content.replace(
    '''  await db.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  return NextResponse.json({ success: true });''',
    '''  await db.apiKey.update({
    where: { id },
    data: { revokedAt: new Date() },
  });

  await logActivity({
    userId,
    app: "Developer Portal",
    action: `API key "${key.name}" revoked`,
    color: "#FF3366",
  });

  return NextResponse.json({ success: true });'''
)

with open(path, "w") as f:
    f.write(content)
print("Patched keys route with activity logging.")
