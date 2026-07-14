import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { WorkflowEngine } from "@/lib/workflows/workflow-engine";

// GET: List all workflows
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any).id;

    const workflows = await WorkflowEngine.listWorkflows(userId);
    return NextResponse.json({ success: true, workflows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new workflow
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any).id;

    const { name, description, steps } = await req.json();

    if (!name || !steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: "name and steps[] are required" }, { status: 400 });
    }

    const workflow = await WorkflowEngine.createWorkflow(userId, name, description || "", steps);
    return NextResponse.json({ success: true, workflow });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
