import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activityLogger";

// GET single agent with stats
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

    const agent = await db.flowAgent.findFirst({
      where: { id, userId },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
          take: 20,
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Compute stats
    const [totalTasks, completedTasks, failedTasks, runningTasks] =
      await Promise.all([
        db.flowTask.count({ where: { agentId: id, userId } }),
        db.flowTask.count({
          where: { agentId: id, userId, status: "COMPLETED" },
        }),
        db.flowTask.count({
          where: { agentId: id, userId, status: "FAILED" },
        }),
        db.flowTask.count({
          where: { agentId: id, userId, status: "RUNNING" },
        }),
      ]);

    return NextResponse.json({
      success: true,
      agent,
      stats: { totalTasks, completedTasks, failedTasks, runningTasks },
    });
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH — update agent fields
export async function PATCH(
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
    const body = await req.json();

    // Verify ownership
    const existing = await db.flowAgent.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.systemPrompt !== undefined) updateData.systemPrompt = body.systemPrompt;
    if (body.status !== undefined && ["ACTIVE", "PAUSED"].includes(body.status)) {
      updateData.status = body.status;
    }

    const agent = await db.flowAgent.update({
      where: { id },
      data: updateData,
    });

    let actionDesc = `Updated agent: ${agent.name}`;
    if (body.status !== undefined && body.status !== existing.status) {
      actionDesc = body.status === "PAUSED" ? `Paused agent: ${agent.name}` : `Resumed agent: ${agent.name}`;
    }

    await logActivity({
      userId,
      app: "Flow AI",
      action: actionDesc,
      color: "#00E5FF",
    });

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE — remove agent and cascade tasks
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

    // Verify ownership
    const existing = await db.flowAgent.findFirst({ where: { id, userId } });
    if (!existing) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    await db.flowAgent.delete({ where: { id } });

    await logActivity({
      userId,
      app: "Flow AI",
      action: `Deleted agent: ${existing.name}`,
      color: "#FF3366",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
