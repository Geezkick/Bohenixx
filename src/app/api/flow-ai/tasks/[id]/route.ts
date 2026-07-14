import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { AgentExecutor } from "@/lib/agents/agent-executor";
import { logActivity } from "@/lib/activityLogger";
import { triggerWebhooks } from "@/lib/webhookEngine";

// GET single task
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const task = await db.flowTask.findFirst({
      where: { id, userId },
      include: { agent: true },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE single task
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.flowTask.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await db.flowTask.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// POST — retry a failed task
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await db.flowTask.findFirst({
      where: { id, userId },
      include: { agent: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Reset task to RUNNING
    await db.flowTask.update({
      where: { id },
      data: { status: "RUNNING", result: null, error: null, startedAt: new Date(), completedAt: null },
    });

    try {
      const execution = await AgentExecutor.executeTask({
        agentId: existing.agent.id,
        userId,
        messages: [{ role: "user", content: existing.prompt }],
        taskId: id,
      });

      const completedTask = { ...existing, result: execution.text, status: "COMPLETED", toolCalls: JSON.stringify(execution.toolCalls) };

      await triggerWebhooks(userId, "flow_ai.task.completed", {
        task_id: completedTask.id,
        agent_id: existing.agent.id,
        agent_type: existing.agent.type,
        prompt: existing.prompt,
        result: execution.text,
        status: "success"
      });

      await logActivity({
        userId,
        app: "Flow AI",
        action: `Task retried and completed by ${existing.agent.name}`,
        color: "#7B2DFF",
      });

      return NextResponse.json({ success: true, task: completedTask });
    } catch (aiError: any) {
      await db.flowTask.update({
        where: { id },
        data: {
          status: "FAILED",
          error: aiError.message || "AI execution failed",
          completedAt: new Date(),
        },
      });

      await triggerWebhooks(userId, "flow_ai.task.failed", {
        task_id: id,
        agent_id: existing.agent.id,
        agent_type: existing.agent.type,
        prompt: existing.prompt,
        error: aiError.message || "AI execution failed",
        status: "failed"
      });
      return NextResponse.json({ success: false, error: aiError.message || "AI execution failed" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error retrying task:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
