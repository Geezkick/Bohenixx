import { db } from "@/lib/db";
import { FlowAgent } from "@prisma/client";

/**
 * BOHENIX ZERO-TRUST TOOL ROUTER
 * Enforces strict authorization before any agent can execute any tool.
 * Agents cannot guess or hallucinate tools they do not have explicit permissions for in the AgentTool table.
 */
export class ToolRouter {
  
  /**
   * Attempts to route a tool execution request.
   * Throws an error if the agent is unauthorized.
   */
  static async executeTool(agent: FlowAgent, toolName: string, parameters: any) {
    // 1. Zero-Trust Verification
    const authorizedTool = await db.agentTool.findUnique({
      where: {
        agentId_toolName: {
          agentId: agent.id,
          toolName: toolName
        }
      }
    });

    if (!authorizedTool || !authorizedTool.isEnabled) {
      // Log the security violation to the audit log (or activity logger)
      console.warn(`[ZERO TRUST VIOLATION] Agent ${agent.name} (${agent.type}) attempted to use unauthorized tool: ${toolName}`);
      throw new Error(`SECURITY EXCEPTION: Agent is not authorized to use the [${toolName}] tool.`);
    }

    // 2. Parse overrides from the agent's specific tool config
    let mergedConfig = parameters;
    if (authorizedTool.config) {
      try {
        const customConfig = JSON.parse(authorizedTool.config);
        mergedConfig = { ...parameters, ...customConfig };
      } catch (e) {
        console.error("Failed to parse tool config override", e);
      }
    }

    // 3. Route to the actual tool implementation
    return this.dispatchToImplementation(toolName, mergedConfig);
  }

  /**
   * Dispatches the verified request to the physical tool implementation.
   */
  private static async dispatchToImplementation(toolName: string, config: any) {
    console.log(`[TOOL ROUTER] Executing ${toolName} with config:`, config);
    
    // In production, this would dynamically import or map to actual functions
    // e.g., mpesa_api_access -> MpesaEngine.execute(config)
    
    switch (toolName) {
      case "mpesa_api_access":
        return { success: true, result: "M-Pesa transaction initiated." };
      case "financial_dashboard_access":
        return { success: true, result: "Retrieved financial overview." };
      case "workflow_orchestrator":
        return { success: true, result: "Spawned sub-tasks for department leads." };
      default:
        return { success: true, result: `Executed generic tool protocol: ${toolName}` };
    }
  }
}
