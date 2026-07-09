import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    // Re-execute with Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await db.flowTask.update({
        where: { id },
        data: { status: "FAILED", error: "Gemini API key not configured", completedAt: new Date() },
      });
      return NextResponse.json({ success: false, error: "Gemini API key not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const agent = existing.agent;
    const systemPrompt = agent.systemPrompt || `You are an expert ${agent.type} AI agent named ${agent.name}. Execute the user's task professionally and autonomously. Provide the final result of your work. Do not ask follow-up questions, just do the work to the best of your ability.`;

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemPrompt,
      });

      const result = await model.generateContent(existing.prompt);
      const responseText = result.response.text();

      const completedTask = await db.flowTask.update({
        where: { id },
        data: {
          status: "COMPLETED",
          result: responseText,
          error: null,
          completedAt: new Date(),
        },
        include: { agent: true },
      });

      // Update agent stats
      await db.flowAgent.update({
        where: { id: agent.id },
        data: { tasksCompleted: { increment: 1 }, lastActiveAt: new Date() },
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
      return NextResponse.json({ success: false, error: aiError.message || "AI execution failed" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error retrying task:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
