import { SchemaType } from "@google/generative-ai";
import { ToolDefinition } from "../tool-registry";
import { db } from "@/lib/db";

const prisma = db as any;

export const delegateTaskTool: ToolDefinition = {
  name: "delegate_task",
  description: "Delegate a subtask to another AI agent in the workforce. The other agent will process the task and return a result.",
  permissionsRequired: ["can_delegate"],
  declaration: {
    name: "delegate_task",
    description: "Assigns a task to another agent and returns their response.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        targetAgentName: { type: SchemaType.STRING, description: "Name of the agent to delegate to" },
        task: { type: SchemaType.STRING, description: "The task description/prompt for the target agent" }
      },
      required: ["targetAgentName", "task"],
    },
  },
  execute: async (args, context) => {
    try {
      // Find the target agent by name within the same user's workforce
      const targetAgent = await prisma.flowAgent.findFirst({
        where: { userId: context.userId, name: { contains: args.targetAgentName, mode: "insensitive" } }
      });

      if (!targetAgent) {
        return { success: false, error: `No agent named "${args.targetAgentName}" found in your workforce.` };
      }

      if (targetAgent.status !== "ACTIVE") {
        return { success: false, error: `Agent "${targetAgent.name}" is currently paused.` };
      }

      // Execute the delegated task via internal chat endpoint
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/flow-ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-internal-workflow": "true" },
        body: JSON.stringify({
          agentId: targetAgent.id,
          messages: [{ role: "user", content: `[DELEGATED TASK from another agent]\n\n${args.task}` }],
          userId: context.userId
        })
      });

      const data = await res.json();

      if (data.success) {
        return {
          success: true,
          data: {
            delegatedTo: targetAgent.name,
            response: data.response,
            taskId: data.taskId
          }
        };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

export const requestReviewTool: ToolDefinition = {
  name: "request_review",
  description: "Request another agent to review and provide feedback on a piece of work (text, plan, email draft, etc.).",
  permissionsRequired: ["can_delegate"],
  declaration: {
    name: "request_review",
    description: "Sends content to another agent for review and returns their feedback.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        reviewerAgentName: { type: SchemaType.STRING, description: "Name of the agent to review the work" },
        content: { type: SchemaType.STRING, description: "The content to be reviewed" },
        reviewInstructions: { type: SchemaType.STRING, description: "Specific instructions for the reviewer" }
      },
      required: ["reviewerAgentName", "content"],
    },
  },
  execute: async (args, context) => {
    try {
      const reviewer = await prisma.flowAgent.findFirst({
        where: { userId: context.userId, name: { contains: args.reviewerAgentName, mode: "insensitive" } }
      });

      if (!reviewer) {
        return { success: false, error: `No agent named "${args.reviewerAgentName}" found.` };
      }

      const reviewPrompt = `[REVIEW REQUEST]\n\nPlease review the following content and provide constructive feedback:\n\n---\n${args.content}\n---\n\n${args.reviewInstructions ? `Additional instructions: ${args.reviewInstructions}` : "Provide feedback on clarity, accuracy, and completeness."}`;

      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/flow-ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-internal-workflow": "true" },
        body: JSON.stringify({
          agentId: reviewer.id,
          messages: [{ role: "user", content: reviewPrompt }],
          userId: context.userId
        })
      });

      const data = await res.json();

      if (data.success) {
        return {
          success: true,
          data: {
            reviewer: reviewer.name,
            feedback: data.response
          }
        };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};

export const listWorkforceTool: ToolDefinition = {
  name: "list_workforce",
  description: "List all AI agents currently in the user's workforce, including their names, departments, and statuses.",
  declaration: {
    name: "list_workforce",
    description: "Returns a list of all agents in the workforce.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {},
      required: [],
    },
  },
  execute: async (_args, context) => {
    try {
      const agents = await prisma.flowAgent.findMany({
        where: { userId: context.userId },
        select: { id: true, name: true, type: true, status: true, department: true, tasksCompleted: true }
      });

      return {
        success: true,
        data: { agents, totalAgents: agents.length }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};
