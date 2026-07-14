import { FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { sendPaymentTool, checkPaymentStatusTool, createInvoiceTool, reconcilePaymentsTool } from "./tools/mpesa-tools";
import { verifyKraPinTool, scanDocumentTool } from "./tools/document-tools";

export type AgentToolContext = {
  userId: string;
  agentId: string;
  department?: string | null;
  permissions?: string[] | null;
};

export type ToolExecutionResult = {
  success: boolean;
  data?: any;
  error?: string;
  requiresApproval?: boolean;
  approvalDetails?: any;
};

export interface ToolDefinition {
  name: string;
  description: string;
  declaration: FunctionDeclaration;
  permissionsRequired?: string[];
  execute: (args: any, context: AgentToolContext) => Promise<ToolExecutionResult>;
}

const tools = new Map<string, ToolDefinition>();

// --- Built-in Tools ---

export const sendEmailTool: ToolDefinition = {
  name: "send_email",
  description: "Send an email to a customer, team member, or supplier. Use this when you need to communicate externally.",
  permissionsRequired: ["can_send_email"],
  declaration: {
    name: "send_email",
    description: "Sends an email to the specified recipient.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        to: { type: SchemaType.STRING, description: "Email address of the recipient" },
        subject: { type: SchemaType.STRING, description: "Subject of the email" },
        body: { type: SchemaType.STRING, description: "Body content of the email" },
      },
      required: ["to", "subject", "body"],
    },
  },
  execute: async (args, context) => {
    // In a real implementation, this would call your email service (e.g. Resend, Sendgrid)
    // For now, we simulate success and log it
    console.log(`[Tool: send_email] Agent ${context.agentId} sending email to ${args.to}`);
    return { success: true, data: { status: "sent", messageId: "simulated-" + Date.now() } };
  }
};


export const searchWebTool: ToolDefinition = {
  name: "search_web",
  description: "Search the web for real-time information, news, or competitor analysis.",
  declaration: {
    name: "search_web",
    description: "Searches the internet for information.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: { type: SchemaType.STRING, description: "The search query" },
      },
      required: ["query"],
    },
  },
  execute: async (args, context) => {
    console.log(`[Tool: search_web] Searching for: ${args.query}`);
    // Simulate web search results
    return { success: true, data: { results: [`Information about ${args.query} is currently simulated. Real search requires an API integration like SerpApi or Tavily.`] } };
  }
};

// Register built-in tools
export const registerTool = (tool: ToolDefinition) => {
  tools.set(tool.name, tool);
};

registerTool(sendEmailTool);
registerTool(createInvoiceTool);
registerTool(searchWebTool);
registerTool(sendPaymentTool);
registerTool(checkPaymentStatusTool);
registerTool(reconcilePaymentsTool);
registerTool(verifyKraPinTool);
registerTool(scanDocumentTool);

export const getTool = (name: string): ToolDefinition | undefined => {
  return tools.get(name);
};

export const getAllTools = (): ToolDefinition[] => {
  return Array.from(tools.values());
};

export const getGeminiToolDeclarations = (toolNames: string[]): FunctionDeclaration[] => {
    return toolNames
        .map(name => getTool(name)?.declaration)
        .filter((dec): dec is FunctionDeclaration => dec !== undefined);
};
