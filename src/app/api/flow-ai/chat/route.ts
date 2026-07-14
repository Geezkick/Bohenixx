import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { AgentExecutor } from "@/lib/agents/agent-executor";
import { logActivity } from "@/lib/activityLogger";
import { triggerWebhooks } from "@/lib/webhookEngine";

// Chat endpoint — multi-turn conversation with an agent
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId, messages } = await req.json();
    // messages = [{ role: "user", content: "..." }, { role: "model", content: "..." }, ...]

    if (!agentId || !messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: "Missing agentId or messages" }, { status: 400 });
    }

    // Verify agent ownership
    const agent = await db.flowAgent.findFirst({ where: { id: agentId, userId } });
    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    if (agent.status === "PAUSED") {
      return NextResponse.json({ success: false, error: "Agent is paused. Resume it to chat." }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    
    const execution = await AgentExecutor.executeTask({
      agentId,
      userId,
      messages: messages
    });

    const responseText = execution.text;
    const taskId = execution.taskId;

    // Update agent stats
    await db.flowAgent.update({
      where: { id: agentId },
      data: { tasksCompleted: { increment: 1 }, lastActiveAt: new Date() },
    });

    await triggerWebhooks(userId, "flow_ai.task.completed", {
      task_id: taskId,
      agent_id: agentId,
      agent_type: agent.type,
      prompt: lastMessage.content,
      result: responseText,
      status: "success"
    });

    await logActivity({
      userId,
      app: "Flow AI Chat",
      action: `Chat task completed by ${agent.name}`,
      color: "#00E5FF",
    });

    return NextResponse.json({
      success: true,
      response: responseText,
      taskId: taskId,
      toolCalls: execution.toolCalls
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Chat failed" },
      { status: 500 }
    );
  }
}
