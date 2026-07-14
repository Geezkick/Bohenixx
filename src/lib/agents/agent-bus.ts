import { db } from "@/lib/db";

export type MessageType = "REQUEST" | "DELEGATE" | "NOTIFY" | "ESCALATE";

export const AgentBus = {
  /**
   * Send a message from one agent to another by creating a new task.
   */
  async sendMessage(params: {
    fromAgentId: string;
    toAgentId: string;
    userId: string;
    type: MessageType;
    content: string;
    parentTaskId?: string;
  }) {
    const fromAgent = await db.flowAgent.findUnique({ where: { id: params.fromAgentId } });
    if (!fromAgent) throw new Error("Sender agent not found");

    const prompt = `[MESSAGE FROM ${fromAgent.name} (${fromAgent.type}) - TYPE: ${params.type}]\n\n${params.content}\n\nPlease handle this request and provide a response.`;

    const task = await db.flowTask.create({
      data: {
        agentId: params.toAgentId,
        userId: params.userId,
        prompt: prompt,
        status: "RUNNING",
        parentTaskId: params.parentTaskId,
      }
    });

    // In a real event-driven system (Phase 6), we would publish to Redis/Kafka here.
    // For now, we return the task ID. The dashboard or background worker would pick this up.
    
    return task;
  },

  /**
   * Find available agents in the organization
   */
  async getAvailableAgents(userId: string, excludeAgentId?: string) {
    return db.flowAgent.findMany({
      where: {
        userId,
        status: "ACTIVE",
        ...(excludeAgentId ? { id: { not: excludeAgentId } } : {})
      },
      select: {
        id: true,
        name: true,
        type: true,
        department: true,
        description: true
      }
    });
  }
};
