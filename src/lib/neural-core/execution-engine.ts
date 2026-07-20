import { db } from "@/lib/db";
import { FlowAgent, FlowTask } from "@prisma/client";
import { ToolRouter } from "./tool-router";

/**
 * BOHENIX EXECUTION ENGINE
 * Handles the actual execution of authorized tasks and the subsequent learning phase.
 */
export class ExecutionEngine {
  
  /**
   * Executes an authorized plan, communicating strictly via the Tool Router.
   */
  static async executeAuthorizedPlan(task: FlowTask, agent: FlowAgent, planSteps: { action: string, tool: string, params: any }[]) {
    console.log(`[EXECUTION ENGINE] Commencing execution for Task ${task.id} by Agent ${agent.name}`);
    
    let executionResults = [];
    
    // Execute each step securely
    for (const step of planSteps) {
      try {
        const result = await ToolRouter.executeTool(agent, step.tool, step.params);
        executionResults.push({ step: step.action, status: "SUCCESS", data: result });
      } catch (error: any) {
        console.error(`[EXECUTION ENGINE] Step failed: ${step.action}`, error);
        executionResults.push({ step: step.action, status: "FAILED", reason: error.message });
        
        // If it's a security violation, we immediately halt the entire execution pipeline
        if (error.message.includes("SECURITY EXCEPTION")) {
          throw error;
        }
      }
    }

    const allSuccessful = executionResults.every(r => r.status === "SUCCESS");
    
    // Log the Decision
    await db.decisionLog.create({
      data: {
        taskId: task.id,
        agentId: agent.id,
        actionTaken: `Executed ${planSteps.length} steps.`,
        reasoning: "Task passed simulation and authorization policies.",
        confidenceScore: allSuccessful ? 0.95 : 0.4,
        expectedRoi: allSuccessful ? "High probability of positive outcome" : "Execution compromised by step failures."
      }
    });

    // Run the Learning Phase
    await this.learnFromExecution(agent, task, executionResults);

    // Update Task Status
    const completedTask = await db.flowTask.update({
      where: { id: task.id },
      data: { 
        status: allSuccessful ? "COMPLETED" : "FAILED",
        result: JSON.stringify(executionResults),
        completedAt: new Date()
      }
    });

    return completedTask;
  }

  /**
   * LEARNING ENGINE
   * Evaluates the outcome and writes to long-term memory to improve future execution.
   */
  private static async learnFromExecution(agent: FlowAgent, task: FlowTask, results: any[]) {
    // Determine if there's a valuable lesson
    const failedSteps = results.filter(r => r.status === "FAILED");
    
    if (failedSteps.length > 0) {
      // Agent learns from failure
      const lesson = `Failed to execute ${failedSteps[0].step} due to ${failedSteps[0].reason}. Must verify parameters before attempting again.`;
      
      await db.agentMemory.create({
        data: {
          agentId: agent.id,
          category: "decision",
          key: `lesson_task_${task.id}`,
          value: lesson,
          importance: 0.8
        }
      });
      console.log(`[LEARNING ENGINE] Agent ${agent.name} recorded a failure lesson.`);
    } else {
      // Agent reinforces success
      await db.agentMemory.create({
        data: {
          agentId: agent.id,
          category: "fact",
          key: `success_task_${task.id}`,
          value: "Successfully executed standard operating procedure for this task type.",
          importance: 0.3
        }
      });
    }
  }
}
