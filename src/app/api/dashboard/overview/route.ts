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

  const [activeKeyCount, activeWebhookCount, user, recentActivity, activeAgents, completedTasks, subscription] = await Promise.all([
    db.apiKey.count({ where: { userId, revokedAt: null } }),
    db.webhook.count({ where: { userId, isActive: true } }),
    db.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true, password: true, createdAt: true, accounts: { select: { provider: true } } },
    }),
    db.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.flowAgent.count({ where: { userId, status: "ACTIVE" } }),
    db.flowTask.count({ where: { userId, status: "COMPLETED" } }),
    db.subscription.findUnique({ where: { userId } }),
  ]);

  const hasPassword = !!user?.password;
  const providers = user?.accounts.map((a) => a.provider) || [];
  const signInMethod = providers.length > 0 ? providers.join(", ") : hasPassword ? "email" : "unknown";

  return NextResponse.json({
    apiKeyCount: activeKeyCount,
    webhookCount: activeWebhookCount,
    accountCreatedAt: user?.createdAt || null,
    signInMethod,
    hasPassword,
    recentActivity,
    flowAi: {
      activeAgents,
      completedTasks,
    },
    subscription: subscription ? {
      active: subscription.status === "active",
      plan: subscription.stripePriceId || "Starter",
      status: subscription.status,
      currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
    } : null,
  });
}
