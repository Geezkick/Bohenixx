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

    const url = new URL(req.url);
    const agentId = url.searchParams.get("agentId");
    const status = url.searchParams.get("status");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const where: Record<string, any> = { userId };
    if (agentId) where.agentId = agentId;
    if (status && ["RUNNING", "COMPLETED", "FAILED"].includes(status)) {
      where.status = status;
    }

    const [tasks, total] = await Promise.all([
      db.flowTask.findMany({
        where,
        include: { agent: { select: { id: true, name: true, type: true } } },
        orderBy: { createdAt: "desc" },
        take: Math.min(limit, 100),
        skip: offset,
      }),
      db.flowTask.count({ where }),
    ]);

    return NextResponse.json({ success: true, tasks, total, limit, offset });
  } catch (error) {
    console.error("Error fetching flow tasks:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// Agent type-specific system prompts for better results
const AGENT_SYSTEM_PROMPTS: Record<string, string> = {
  Sales: "You are a world-class Sales AI agent. You excel at writing cold outreach emails, sales proposals, follow-up sequences, competitive analysis, lead qualification frameworks, and pitch decks. Always provide actionable, ready-to-send content.",
  Marketing: "You are a top-tier Marketing AI agent. You create compelling campaigns, social media strategies, email sequences, content calendars, SEO-optimized blog posts, ad copy, and brand messaging. Deliver polished, ready-to-publish content.",
  HR: "You are an expert HR AI agent. You handle job descriptions, interview questions, onboarding checklists, performance review templates, employee handbook sections, benefits comparisons, and HR policy drafts. Produce professional, compliant documents.",
  Finance: "You are a precision Finance AI agent. You generate invoices, expense reports, budget forecasts, financial analyses, revenue projections, cash flow statements, and tax preparation checklists. Use clear tables and numbers.",
  Operations: "You are an Operations Excellence AI agent. You optimize processes, create SOPs, design workflow diagrams, build project timelines, inventory management plans, and supply chain analyses. Focus on efficiency and measurable outcomes.",
  Legal: "You are a Legal Assistant AI agent. You draft contracts, NDAs, terms of service, privacy policies, compliance checklists, and legal memos. Always include appropriate disclaimers and note that your output should be reviewed by a licensed attorney.",
  Support: "You are a Customer Support AI agent. You create FAQ documents, support scripts, ticket response templates, escalation procedures, CSAT survey designs, and knowledge base articles. Focus on empathy and resolution.",
  Analytics: "You are a Data Analytics AI agent. You analyze trends, create dashboard specifications, write data queries, build KPI frameworks, generate insight reports, and design A/B testing plans. Use data-driven reasoning.",
  "Project Management": "You are a Project Management AI agent. You create project plans, sprint backlogs, risk registers, status reports, RACI matrices, and retrospective frameworks. Focus on clarity, deadlines, and accountability.",
  "Executive Assistant": "You are an Executive AI Assistant. You draft executive summaries, prepare meeting agendas, write follow-up emails, create briefing documents, manage calendar priorities, and compose professional correspondence.",
  Custom: "You are a versatile AI agent. Execute the user's task professionally and provide complete, polished results. Adapt your tone and format to the task at hand.",
};

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

    // Verify agent exists, belongs to user, and is active
    const agent = await db.flowAgent.findFirst({
      where: { id: agentId, userId },
    });

    if (!agent) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    if (agent.status === "PAUSED") {
      return NextResponse.json({ success: false, error: "Agent is paused. Resume it before assigning tasks." }, { status: 400 });
    }

    // 1. Create task in RUNNING state
    const startTime = new Date();
    const task = await db.flowTask.create({
      data: {
        userId,
        agentId,
        prompt,
        status: "RUNNING",
        startedAt: startTime,
      },
    });

    // 2. Call Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      await db.flowTask.update({
        where: { id: task.id },
        data: { status: "FAILED", error: "Gemini API key not configured", completedAt: new Date() },
      });
      return NextResponse.json({ success: false, error: "Gemini API key not configured" }, { status: 500 });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);

      const basePrompt = AGENT_SYSTEM_PROMPTS[agent.type] || AGENT_SYSTEM_PROMPTS.Custom;
      const systemPrompt = agent.systemPrompt
        ? `${basePrompt}\n\nAdditional Instructions: ${agent.systemPrompt}`
        : basePrompt;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `${systemPrompt}\n\nYour name is ${agent.name}. You are working within the Bohenix Flow AI platform. Execute tasks thoroughly and provide complete, ready-to-use results.`,
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const completedAt = new Date();

      // 3. Update task with result
      const completedTask = await db.flowTask.update({
        where: { id: task.id },
        data: {
          status: "COMPLETED",
          result: responseText,
          completedAt,
        },
        include: { agent: { select: { id: true, name: true, type: true } } },
      });

      // 4. Update agent stats
      await db.flowAgent.update({
        where: { id: agentId },
        data: { tasksCompleted: { increment: 1 }, lastActiveAt: completedAt },
      });

      return NextResponse.json({ success: true, task: completedTask });
    } catch (aiError: any) {
      const completedAt = new Date();

      // Mark task as failed with error details
      const failedTask = await db.flowTask.update({
        where: { id: task.id },
        data: {
          status: "FAILED",
          error: aiError.message || "AI execution failed",
          completedAt,
        },
        include: { agent: { select: { id: true, name: true, type: true } } },
      });

      await db.flowAgent.update({
        where: { id: agentId },
        data: { lastActiveAt: completedAt },
      });

      return NextResponse.json({ success: true, task: failedTask });
    }
  } catch (error: any) {
    console.error("Error executing flow task:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to execute task" }, { status: 500 });
  }
}

// DELETE — clear all tasks (with optional filters)
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const agentId = url.searchParams.get("agentId");
    const status = url.searchParams.get("status");

    const where: Record<string, any> = { userId };
    if (agentId) where.agentId = agentId;
    if (status) where.status = status;

    const result = await db.flowTask.deleteMany({ where });

    return NextResponse.json({ success: true, deleted: result.count });
  } catch (error) {
    console.error("Error deleting tasks:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
