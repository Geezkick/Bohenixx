import os

path = "src/lib/activityLogger.ts"

content = '''import { db } from "@/lib/db";

export async function logActivity(params: {
  userId?: string | null;
  app: string;
  action: string;
  color?: string;
}) {
  try {
    await db.activityLog.create({
      data: {
        userId: params.userId || null,
        app: params.app,
        action: params.action,
        color: params.color || "#00E5FF",
      },
    });
  } catch {
    // Activity logging is best-effort; never block the main request on it.
  }
}
'''

with open(path, "w") as f:
    f.write(content)

print(f"Created {path}")
