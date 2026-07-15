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

  try {
    const [
      activeKeyCount, 
      activeWebhookCount, 
      user, 
      recentActivity, 
      agents, 
      completedTasks, 
      subscription,
      pendingApprovals
    ] = await Promise.all([
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
      // Fetch active agents with their latest task and tools
      db.flowAgent.findMany({ 
        where: { userId, status: "ACTIVE" },
        include: {
          tasks: {
            orderBy: { createdAt: "desc" },
            take: 1
          },
          tools: true
        }
      }),
      db.flowTask.count({ where: { userId, status: "COMPLETED" } }),
      db.subscription.findUnique({ where: { userId } }),
      // Fetch pending human approvals
      db.approvalRequest.findMany({
        where: { userId, status: "PENDING" },
        include: {
          task: {
            include: { agent: true }
          }
        }
      })
    ]);

    const hasPassword = !!user?.password;
    const providers = user?.accounts.map((a) => a.provider) || [];
    const signInMethod = providers.length > 0 ? providers.join(", ") : hasPassword ? "email" : "unknown";

    // Transform backend agent data into OS representation
    const mappedAgents = agents.map(agent => {
      const latestTask = agent.tasks[0];
      const isExecuting = latestTask && latestTask.status === "RUNNING";
      
      // We derive a "confidence" metric or state from the model (mocked 95% if executing)
      const confidence = isExecuting ? `${Math.floor(Math.random() * 10 + 90)}%` : "-";
      const tool = agent.tools.length > 0 ? agent.tools[0].toolName : "None";

      // Assign a color based on role
      const role = agent.type || "assistant";
      let color = "#A78BFA";
      if (role === "finance" || role === "sales") color = "#22c55e";
      if (role === "support" || role === "operations") color = "#3B82F6";
      if (role === "legal") color = "#F59E0B";

      return {
        id: agent.id,
        name: agent.name,
        role: role.charAt(0).toUpperCase() + role.slice(1),
        status: isExecuting ? "Executing" : "Idle",
        currentTask: isExecuting ? latestTask.prompt : "Waiting for next assignment",
        confidence,
        tool,
        color
      };
    });

    const moneySaved = completedTasks * 25.50; // Simple estimation logic: ~$25 value per autonomous task

    return NextResponse.json({
      apiKeyCount: activeKeyCount,
      webhookCount: activeWebhookCount,
      accountCreatedAt: user?.createdAt || null,
      signInMethod,
      hasPassword,
      recentActivity,
      flowAi: {
        activeAgentsCount: agents.length,
        agents: mappedAgents,
        completedTasks,
        moneySaved,
        pendingApprovals: pendingApprovals.map(req => ({
          id: req.id,
          agentName: req.task.agent.name,
          action: req.action,
          amountKes: req.amountKes,
          createdAt: req.createdAt
        }))
      },
      subscription: subscription ? {
        active: subscription.status === "active",
        plan: subscription.stripePriceId || "Starter",
        status: subscription.status,
        currentPeriodEnd: subscription.stripeCurrentPeriodEnd,
      } : null,
    });
  } catch (error) {
    console.error("Failed to fetch overview data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
