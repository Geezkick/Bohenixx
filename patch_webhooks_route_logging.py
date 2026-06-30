path = "src/app/api/developer/webhooks/route.ts"
with open(path, "r") as f:
    content = f.read()

content = content.replace(
    'import { db } from "@/lib/db";',
    'import { db } from "@/lib/db";\nimport { logActivity } from "@/lib/activityLogger";'
)

content = content.replace(
    '''  const webhook = await db.webhook.create({
    data: { userId, url, description, secret },
  });

  return NextResponse.json({ webhook });''',
    '''  const webhook = await db.webhook.create({
    data: { userId, url, description, secret },
  });

  await logActivity({
    userId,
    app: "Developer Portal",
    action: `Webhook added for ${new URL(url).hostname}`,
    color: "#00E5FF",
  });

  return NextResponse.json({ webhook });'''
)

content = content.replace(
    '''  await db.webhook.delete({ where: { id } });

  return NextResponse.json({ success: true });''',
    '''  await db.webhook.delete({ where: { id } });

  await logActivity({
    userId,
    app: "Developer Portal",
    action: `Webhook removed for ${new URL(webhook.url).hostname}`,
    color: "#FF3366",
  });

  return NextResponse.json({ success: true });'''
)

with open(path, "w") as f:
    f.write(content)
print("Patched webhooks route with activity logging.")
