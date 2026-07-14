import { db } from "@/lib/db";

const prisma = db as any;

export const WorkflowEngine = {
  /**
   * Create a new multi-agent workflow
   */
  async createWorkflow(userId: string, name: string, description: string, steps: Array<{ agentId: string; prompt: string; dependsOn?: string }>) {
    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name,
        description,
        status: "DRAFT",
        steps: {
          create: steps.map((step, index) => ({
            agentId: step.agentId,
            stepOrder: index + 1,
            prompt: step.prompt,
            status: "PENDING",
            dependsOn: step.dependsOn || null
          }))
        }
      },
      include: { steps: { include: { agent: true }, orderBy: { stepOrder: "asc" } } }
    });

    return workflow;
  },

  /**
   * Execute a workflow by running steps in dependency order.
   * Steps without dependencies run first. Steps with dependsOn wait until their dependency completes.
   * Previous step results are injected into the prompt as context.
   */
  async executeWorkflow(workflowId: string, userId: string) {
    // Mark workflow as running
    await prisma.workflow.update({
      where: { id: workflowId },
      data: { status: "RUNNING" }
    });

    const steps = await prisma.workflowStep.findMany({
      where: { workflowId },
      orderBy: { stepOrder: "asc" },
      include: { agent: true }
    });

    const completedResults: Record<string, string> = {};

    for (const step of steps) {
      // Check if this step's dependency is satisfied
      if (step.dependsOn && !completedResults[step.dependsOn]) {
        // Check if the dependency failed
        const depStep = steps.find((s: any) => s.id === step.dependsOn);
        if (depStep && depStep.status === "FAILED") {
          await prisma.workflowStep.update({
            where: { id: step.id },
            data: { status: "SKIPPED", error: "Dependency step failed" }
          });
          continue;
        }
      }

      // Build enriched prompt with context from previous steps
      let enrichedPrompt = step.prompt;
      if (step.dependsOn && completedResults[step.dependsOn]) {
        enrichedPrompt = `CONTEXT FROM PREVIOUS STEP:\n---\n${completedResults[step.dependsOn]}\n---\n\nYOUR TASK:\n${step.prompt}`;
      }

      // Mark step as running
      await prisma.workflowStep.update({
        where: { id: step.id },
        data: { status: "RUNNING" }
      });

      try {
        // Execute via the FlowAgent chat API internally
        const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/flow-ai/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-internal-workflow": "true" },
          body: JSON.stringify({
            agentId: step.agentId,
            messages: [{ role: "user", content: enrichedPrompt }],
            userId // Pass userId for internal auth bypass
          })
        });

        const data = await res.json();

        if (data.success) {
          await prisma.workflowStep.update({
            where: { id: step.id },
            data: { status: "COMPLETED", result: data.response }
          });
          completedResults[step.id] = data.response;
        } else {
          throw new Error(data.error || "Agent execution failed");
        }
      } catch (error: any) {
        await prisma.workflowStep.update({
          where: { id: step.id },
          data: { status: "FAILED", error: error.message }
        });

        // Mark workflow as failed and stop
        await prisma.workflow.update({
          where: { id: workflowId },
          data: { status: "FAILED" }
        });
        return { success: false, error: `Step ${step.stepOrder} failed: ${error.message}` };
      }
    }

    // All steps completed successfully
    await prisma.workflow.update({
      where: { id: workflowId },
      data: { status: "COMPLETED" }
    });

    return { success: true, results: completedResults };
  },

  /**
   * Get workflow with all step details
   */
  async getWorkflow(workflowId: string, userId: string) {
    return prisma.workflow.findFirst({
      where: { id: workflowId, userId },
      include: {
        steps: {
          include: { agent: { select: { id: true, name: true, type: true, avatar: true } } },
          orderBy: { stepOrder: "asc" }
        }
      }
    });
  },

  /**
   * List all workflows for a user
   */
  async listWorkflows(userId: string) {
    return prisma.workflow.findMany({
      where: { userId },
      include: {
        _count: { select: { steps: true } },
        steps: {
          select: { status: true },
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
};
