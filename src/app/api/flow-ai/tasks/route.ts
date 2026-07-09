import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await db.flowTask.findMany({
      where: { userId },
      include: { agent: true },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to recent 50 tasks for performance
    });

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("Error fetching flow tasks:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { agentId, prompt } = await req.json();

    if (!agentId || !prompt) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Verify agent exists and belongs to user
    const agent = await db.flowAgent.findFirst({
      where: { id: agentId, userId }
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    // 1. Save Initial Task state
    const task = await db.flowTask.create({
      data: {
        userId,
        agentId,
        prompt,
        status: "RUNNING"
      }
    });

    // 2. Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key not configured");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemPrompt = agent.systemPrompt || `You are an expert ${agent.type} AI agent named ${agent.name}. Execute the user's task professionally and autonomously. Provide the final result of your work. Do not ask follow-up questions, just do the work to the best of your ability.`;
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 3. Update Task with Result
    const completedTask = await db.flowTask.update({
      where: { id: task.id },
      data: {
        status: "COMPLETED",
        result: responseText
      },
      include: { agent: true }
    });

    // 4. Increment Agent Tasks Completed
    await db.flowAgent.update({
      where: { id: agentId },
      data: { tasksCompleted: { increment: 1 } }
    });

    return NextResponse.json({ success: true, task: completedTask });
  } catch (error: any) {
    console.error("Error executing flow task:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to execute task" }, { status: 500 });
  }
}
