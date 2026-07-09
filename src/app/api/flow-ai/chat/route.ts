import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";
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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const systemPrompt = agent.systemPrompt || `You are an expert ${agent.type} AI agent named ${agent.name} working for Bohenix Flow AI. You help users with ${agent.type}-related tasks. Be professional, thorough, and action-oriented. When asked to do something, provide complete, ready-to-use results. Format your responses clearly with headers and bullet points when appropriate.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // Build chat history
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const responseText = result.response.text();

    // Save as a task for history
    const task = await db.flowTask.create({
      data: {
        userId,
        agentId,
        prompt: lastMessage.content,
        result: responseText,
        status: "COMPLETED",
        startedAt: new Date(),
        completedAt: new Date(),
      },
    });

    // Update agent stats
    await db.flowAgent.update({
      where: { id: agentId },
      data: { tasksCompleted: { increment: 1 }, lastActiveAt: new Date() },
    });

    await triggerWebhooks(userId, "flow_ai.task.completed", {
      task_id: task.id,
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
      taskId: task.id,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Chat failed" },
      { status: 500 }
    );
  }
}
