import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { WorkflowEngine } from "@/lib/workflows/workflow-engine";

// GET: Get workflow details with steps
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any).id;
    const { id } = await params;

    const workflow = await WorkflowEngine.getWorkflow(id, userId);
    if (!workflow) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });

    return NextResponse.json({ success: true, workflow });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Execute a workflow
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const userId = (session.user as any).id;
    const { id } = await params;

    // Verify ownership
    const workflow = await WorkflowEngine.getWorkflow(id, userId);
    if (!workflow) return NextResponse.json({ error: "Workflow not found" }, { status: 404 });

    if (workflow.status === "RUNNING") {
      return NextResponse.json({ error: "Workflow is already running" }, { status: 409 });
    }

    // Execute asynchronously — kick off and return immediately
    const result = await WorkflowEngine.executeWorkflow(id, userId);
    return NextResponse.json({ ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
