import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalAgents,
      activeAgents,
      pausedAgents,
      totalTasks,
      completedTasks,
      failedTasks,
      runningTasks,
      tasksToday,
      tasksThisWeek,
      tasksThisMonth,
      recentTasks,
      topAgents,
    ] = await Promise.all([
      db.flowAgent.count({ where: { userId } }),
      db.flowAgent.count({ where: { userId, status: "ACTIVE" } }),
      db.flowAgent.count({ where: { userId, status: "PAUSED" } }),
      db.flowTask.count({ where: { userId } }),
      db.flowTask.count({ where: { userId, status: "COMPLETED" } }),
      db.flowTask.count({ where: { userId, status: "FAILED" } }),
      db.flowTask.count({ where: { userId, status: "RUNNING" } }),
      db.flowTask.count({ where: { userId, createdAt: { gte: todayStart } } }),
      db.flowTask.count({ where: { userId, createdAt: { gte: weekStart } } }),
      db.flowTask.count({ where: { userId, createdAt: { gte: monthStart } } }),
      db.flowTask.findMany({
        where: { userId },
        include: { agent: { select: { name: true, type: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
      db.flowAgent.findMany({
        where: { userId },
        orderBy: { tasksCompleted: "desc" },
        take: 5,
        select: { id: true, name: true, type: true, tasksCompleted: true, status: true },
      }),
    ]);

    const successRate = totalTasks > 0
      ? Math.round((completedTasks / (completedTasks + failedTasks || 1)) * 100)
      : 0;

    // Compute avg completion time from completed tasks with timing data
    const completedWithTiming = await db.flowTask.findMany({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { not: null },
      },
      select: { startedAt: true, completedAt: true },
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    let avgCompletionMs = 0;
    if (completedWithTiming.length > 0) {
      const totalMs = completedWithTiming.reduce((sum, t) => {
        if (t.completedAt && t.startedAt) {
          return sum + (t.completedAt.getTime() - t.startedAt.getTime());
        }
        return sum;
      }, 0);
      avgCompletionMs = Math.round(totalMs / completedWithTiming.length);
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalAgents,
        activeAgents,
        pausedAgents,
        totalTasks,
        completedTasks,
        failedTasks,
        runningTasks,
        tasksToday,
        tasksThisWeek,
        tasksThisMonth,
        successRate,
        avgCompletionMs,
        recentTasks,
        topAgents,
      },
    });
  } catch (error) {
    console.error("Error fetching flow stats:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
